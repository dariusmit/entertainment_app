import { Context } from "../context/StoreContext";
import { useContext, useState, useEffect, useRef } from "react";
import movieType from "../types/movieType";
import seriesType from "../types/seriesType";
import { isMovieType } from "../helpers/isMovieType";
import { posterRootURL } from "../helpers/posterRootURL";
import {
  axiosJWT,
  config,
  getContentGetReq,
  getContentPostReq,
} from "../axios/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MoviesSectionSkeleton from "./MoviesSectionSkeleton";
import { motion } from "framer-motion";

interface Props {
  title: string;
  path: string;
  reqType?: string;
  horizontalSection?: boolean;
}

function MoviesSection({ title, path, reqType, horizontalSection }: Props) {
  const navigate = useNavigate();

  const {
    debouncedSearchValue,
    searchValue,
    searchCompleted,
    setIsSearchVisible,
  } = useContext(Context);

  const { isLoading, accessToken } = useContext(AuthContext);

  const [isLoadingAI, changeLoadingStatusAI] = useState<boolean>(true);
  const [movies, updateMovies] = useState<(movieType | seriesType)[]>([]);
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([]);

  async function fetchBookmarkedItems() {
    if (isLoading || !accessToken) {
      console.error("Access token not yet available!");
      return;
    }
    try {
      const res = await axiosJWT.post(
        "http://localhost:8081/get_bookmarked_items",
        {},
        config(accessToken)
      );

      if (res.data) {
        const { movies, series } = res.data;
        setBookmarkedItems((prev) => [
          ...prev,
          ...movies.map((m: any) => m.id),
          ...series.map((s: any) => s.id),
        ]);
      }
    } catch (error) {
      console.error("Error fetching bookmarked items:", error);
    }
  }

  async function isBookmarked(
    id: number,
    media_type: string
  ): Promise<boolean> {
    try {
      const res = await axiosJWT.post(
        "http://localhost:8081/is_bookmarked",
        {
          id,
          media_type,
        },
        config(accessToken)
      );

      return typeof res.data.isBookmarked === "boolean"
        ? res.data.isBookmarked
        : false;
    } catch (error) {
      console.error("Error checking bookmark status:", error);
      return false;
    }
  }

  async function handleBookmarkClick(
    movie: movieType | seriesType
  ): Promise<void> {
    const mediaType = isMovieType(movie) ? "movie" : "series";
    const isBookmarkedStatus = await isBookmarked(movie.id, mediaType);

    if (isBookmarkedStatus) {
      await removeBookmark(movie.id, mediaType);
      if (location.pathname === "/bookmarks") {
        location.reload();
      }
    } else {
      await bookmarkContent(movie.id, mediaType);
    }
  }

  async function bookmarkContent(
    id: number,
    media_type: string
  ): Promise<void> {
    try {
      await axiosJWT.post(
        "http://localhost:8081/bookmark_item",
        {
          id,
          movies,
          media_type,
        },
        config(accessToken)
      );
      setBookmarkedItems((prev) => [...prev, id]);
    } catch (err) {
      console.log("Error bookmarking:", err);
    }
  }

  async function removeBookmark(id: number, media_type: string): Promise<void> {
    try {
      await axiosJWT.post(
        "http://localhost:8081/remove_bookmarked_item",
        {
          id,
          media_type,
        },
        config(accessToken)
      );
      setBookmarkedItems((prev) => prev.filter((item) => item !== id));
    } catch (err) {
      console.log("Error removing bookmark:", err);
    }
  }

  function viewContent(movie: movieType | seriesType): void {
    const formattedTitle = isMovieType(movie)
      ? movie.title.replace(/\s+/g, "_").toLowerCase()
      : movie.name.replace(/\s+/g, "_").toLowerCase();

    if (location.pathname === "/") {
      navigate(
        `${isMovieType(movie) ? `/movies` : `/shows`}/${
          movie.id
        }/${formattedTitle}`
      );
    } else if (location.pathname === "/bookmarks") {
      navigate(
        `${isMovieType(movie) ? `/movies` : `/shows`}/${
          movie.id
        }/${formattedTitle}`
      );
    } else navigate(`${location.pathname}/${movie.id}/${formattedTitle}`);
  }

  useEffect(() => {
    if (bookmarkedItems.length === 0) {
      setIsSearchVisible(false);
    } else {
      setIsSearchVisible(true);
    }
  }, [bookmarkedItems]);

  useEffect(() => {
    if (isLoading) return;
    if (!accessToken) {
      console.log("Access token not available yet");
      return;
    }
    fetchBookmarkedItems();
    async function updateContentState() {
      try {
        let data: (movieType | seriesType)[];
        if (reqType === "auth") {
          data = await getContentPostReq(path, config(accessToken));
        } else {
          data = await getContentGetReq(path);
        }

        data = data.filter((item) => item.media_type !== "person");
        updateMovies(data);
        changeLoadingStatusAI(false);
      } catch (err: any) {
        console.error("Error fetching movies:", err.message);
      } finally {
        changeLoadingStatusAI(false);
      }
    }

    updateContentState();
  }, [isLoading, accessToken, debouncedSearchValue]);

  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [scrolling, setScrolling] = useState<boolean>(false);

  function scrollLeft(): void {
    const container = scrollableRef.current;
    if (scrolling) return;

    //gap is 36 px prie 1903
    //gap is 30.24px prie 1440
    const ScrollAmount =
      container!.offsetWidth >= 1266 && container!.offsetWidth < 1671
        ? container!.offsetWidth + 30.24
        : container!.offsetWidth + 40.44;
    console.log(ScrollAmount);
    console.log(container!.offsetWidth);

    setScrolling(true);
    container!.scrollBy({
      left: -ScrollAmount,
      behavior: "smooth",
    });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setScrolling(false);
    }, 1000);
  }

  function scrollRight(): void {
    const container = scrollableRef.current;
    if (scrolling) return;

    //gap is 36 px prie 1903
    //gap is 30.24px prie 1440
    const ScrollAmount =
      container!.offsetWidth >= 1266 && container!.offsetWidth < 1671
        ? container!.offsetWidth + 30.24
        : container!.offsetWidth + 40.44;
    console.log(ScrollAmount);
    console.log(container!.offsetWidth);

    setScrolling(true);
    container!.scrollBy({
      left: ScrollAmount,
      behavior: "smooth",
    });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setScrolling(false);
    }, 1000);
  }

  return (
    <>
      <h1 className="font-light text-[5.33vw] mb-2 m-4 tablet:mx-[3.25vw] tablet:text-[4.17vw] desktop:ml-[10vw] desktop:text-[2.22vw]">
        {searchCompleted
          ? `Found ${movies.length} results for '${searchValue}'`
          : (movies.length !== 0 && title) || (
              <div className="animated">
                <p className="w-[60vw] h-[6.67vw] rounded-md tablet:h-[5.2vw] desktop:w-[40%] desktop:h-[2.5vw]"></p>
              </div>
            )}
      </h1>
      <div className="desktop:z-30 desktop:relative">
        {!isLoadingAI ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.15, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={
              horizontalSection
                ? "hidden desktop:block absolute z-40 top-[6.6vw] left-[10.75vw] w-[1.56vw] h-auto opacity-50"
                : "hidden"
            }
            onClick={scrollLeft}
            disabled={scrolling}
          >
            <img onClick={scrollLeft} src="../../assets/arrow-left.svg" />
          </motion.button>
        ) : null}
        <div
          ref={scrollableRef}
          className={
            horizontalSection
              ? "grid gap-3 grid-flow-col rounded-lg overflow-x-scroll m-4 tablet:mx-[3.25vw] tablet:gap-9 tablet:mb-8 desktop:ml-[10vw] desktop:gap-[2.1vw] w-auto desktop:mr-[2.1vw] custom-scrollbar"
              : "grid grid-cols-2 gap-3 m-4 tablet:mx-[3.25vw] tablet:grid-cols-3 tablet:gap-9 desktop:ml-[10vw] desktop:gap-[2.1vw] desktop:mr-[2.1vw] desktop:grid-cols-4"
          }
        >
          {isLoadingAI ? (
            <MoviesSectionSkeleton horizontalSection={horizontalSection} />
          ) : (
            movies &&
            movies.length != 0 &&
            movies.map((movie: movieType | seriesType) => {
              return (
                <div
                  key={movie.id}
                  className={
                    horizontalSection
                      ? `w-[64vw] h-[37.33vw] relative overflow-x-hidden rounded-lg tablet:w-[61.2vw] desktop:w-[27.9vw] desktopBig:w-[27.61vw] desktop:h-[15.97vw]`
                      : `h-auto relative overflow-hidden rounded-lg`
                  }
                >
                  <img
                    className={`${
                      horizontalSection
                        ? `h-full object-cover`
                        : `h-[29.33vw] tablet:h-[18.23vw] desktop:h-[12.08vw] mb-2 `
                    } w-full rounded-lg hover:brightness-125 hover:cursor-pointer`}
                    src={
                      posterRootURL +
                      `${movie.backdrop_path || movie.poster_path}`
                    }
                    onClick={() => viewContent(movie)}
                  />
                  <div
                    className={
                      horizontalSection
                        ? "absolute bottom-0 left-0 z-10 w-full opacity-50 h-[4vw] gradient"
                        : "hidden"
                    }
                  ></div>
                  <div
                    className={
                      horizontalSection
                        ? "absolute bottom-2 z-20 left-2 overflow-hidden py-1 px-2"
                        : ""
                    }
                  >
                    <div
                      className={
                        !horizontalSection
                          ? "flex text-[3.47vw] font-extralight tablet:text-[1.69vw] desktop:text-[0.9vw]"
                          : "hidden"
                      }
                    >
                      <p className="mr-[1.6vw] tablet:mr-[1.04vw] desktop:mr-[0.56vw]">
                        {isMovieType(movie)
                          ? String(movie.release_date).split("-")[0]
                          : String(movie.first_air_date).split("-")[0]}
                      </p>
                      <p className="mr-[1.6vw] tablet:mr-[1.04vw] desktop:mr-[0.56vw]">
                        ·
                      </p>
                      <div className="flex items-center mr-[1.6vw] tablet:mr-[1.04vw] desktop:mr-[0.56vw]">
                        {isMovieType(movie) ? (
                          <>
                            <img
                              src="../../assets/icon-category-movie.svg"
                              className="w-[2.67vw] h-[2.67vw] mr-1 tablet:mr-[1.04vw] tablet:w-[1.56vw] tablet:h-[1.56vw] desktop:mr-[0.56vw] desktop:w-[0.83vw] desktop:h-[0.83vw]"
                            />
                            <p>Movie</p>
                          </>
                        ) : (
                          <>
                            <img
                              src="../../assets/icon-category-tv.svg"
                              className="w-[2.67vw] h-[2.67vw] mr-1 tablet:mr-[1.04vw] tablet:w-[1.56vw] tablet:h-[1.56vw] desktop:mr-[0.56vw] desktop:w-[0.83vw] desktop:h-[0.83vw]"
                            />
                            <p>Series</p>
                          </>
                        )}
                      </div>
                      <p className="mr-[1.6vw] tablet:mr-[1.04vw] desktop:mr-[0.56vw]">
                        ·
                      </p>
                      <p>{String(Math.round(movie.vote_average * 10) / 10)}</p>
                    </div>
                    <p className="text-[4vw] tablet:text-[2.34vw] desktop:text-[1.25vw]">
                      {isMovieType(movie) ? movie.title : movie.name}
                    </p>
                  </div>
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => handleBookmarkClick(movie)}
                    className="absolute flex justify-center items-center top-0 right-0 m-1 w-[8.53vw] h-[8.53vw] tablet:w-[4.17vw] tablet:h-[4.17vw] tablet:m-3 desktop:w-[2.22vw] desktop:h-[2.22vw] [&>*]:desktop:hover:opacity-100 [&>div]:desktop:hover:border-2 [&>div]:desktop:hover:border-white desktop:cursor-pointer"
                  >
                    <img
                      className="relative z-10"
                      src={
                        bookmarkedItems.includes(movie.id)
                          ? "../../assets/icon-bookmark-full.svg"
                          : "../../assets/icon-bookmark-empty.svg"
                      }
                    />
                    <div className="bg-black absolute top-0 right-0 opacity-50 rounded-full w-[8.53vw] h-[8.53vw] tablet:w-[4.17vw] tablet:h-[4.17vw] desktop:w-[2.22vw] desktop:h-[2.22vw]"></div>
                  </motion.div>
                </div>
              );
            })
          )}
        </div>
        {!isLoadingAI ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.15, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={
              horizontalSection
                ? "hidden desktop:block absolute z-40 top-[6.6vw] right-[2.7vw] w-[1.56vw] h-auto opacity-50"
                : "hidden"
            }
            onClick={scrollRight}
            disabled={scrolling}
          >
            <img src="../../assets/arrow-right.svg" />
          </motion.button>
        ) : null}
      </div>
    </>
  );
}

export default MoviesSection;
