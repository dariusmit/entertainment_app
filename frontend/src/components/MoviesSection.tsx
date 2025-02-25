import { Context } from "../context/StoreContext";
import { useContext, useState, useEffect, useRef } from "react";
import movieType from "../types/movieType";
import seriesType from "../types/seriesType";
import { isMovieType } from "../helpers/isMovieType";
import { posterRootURL } from "../helpers/posterRootURL";
import {
  fetchBookmarkedItems,
  handleBookmarkClick,
} from "./bookmarks_functions/bookmarksFunctions";
import { config, getContentGetReq, getContentPostReq } from "../axios/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MoviesSectionSkeleton from "./MoviesSectionSkeleton";
import { motion } from "framer-motion";
import { scrollLeft, scrollRight } from "./scroll_functions/scrollFunctions";

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
    bookmarkedItems,
    setBookmarkedItems,
  } = useContext(Context);
  const { isLoading, accessToken } = useContext(AuthContext);
  const [isLoadingSkeleton, changeLoadingSkeletonStatus] =
    useState<boolean>(true);
  const [movies, updateMovies] = useState<(movieType | seriesType)[]>([]);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [scrolling, setScrolling] = useState<boolean>(false);

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
    fetchBookmarkedItems(isLoading, accessToken, setBookmarkedItems);
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
        changeLoadingSkeletonStatus(false);
      } catch (err: any) {
        console.error("Error fetching movies:", err.message);
      } finally {
        changeLoadingSkeletonStatus(false);
      }
    }

    updateContentState();
  }, [isLoading, accessToken, debouncedSearchValue]);

  return (
    <>
      <h1 className="font-light text-[5.33vw] mb-2 m-4 tablet:mx-[3.25vw] tablet:text-[4.17vw] desktop:ml-[10vw] desktop:text-[2.22vw]">
        {searchCompleted
          ? `Found ${movies.length} results for '${searchValue}'`
          : movies.length !== 0 && title}
      </h1>
      <div className="desktop:z-30 desktop:relative">
        {!isLoadingSkeleton ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.15, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={
              horizontalSection
                ? "hidden desktop:block absolute z-40 top-[6.6vw] left-[10.75vw] w-[1.56vw] h-auto opacity-50"
                : "hidden"
            }
            onClick={() =>
              scrollLeft(scrollableRef, scrolling, setScrolling, timeoutRef)
            }
            disabled={scrolling}
          >
            <img src="../../assets/arrow-left.svg" />
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
          {isLoadingSkeleton ? (
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
                      ? `w-[64vw] h-[37.33vw] relative overflow-hidden rounded-lg tablet:w-[61.2vw] desktop:w-[27.9vw] desktopBig:w-[27.61vw] desktop:h-[15.97vw]`
                      : `h-auto relative overflow-hidden rounded-lg`
                  }
                >
                  <img
                    className={`${
                      horizontalSection
                        ? `h-full`
                        : `h-[29.33vw] tablet:h-[18.23vw] desktop:h-[12.08vw] mb-2 `
                    } w-full rounded-lg object-cover hover:brightness-125 hover:cursor-pointer`}
                    alt="Image not found..."
                    src={
                      movie.backdrop_path || movie.poster_path
                        ? posterRootURL +
                          (movie.backdrop_path || movie.poster_path)
                        : `../../assets/img-placeholder.png`
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
                          ? String(movie.release_date).split("-")[0] ||
                            "Unknown"
                          : String(movie.first_air_date).split("-")[0] ||
                            "Unknown"}
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
                      <p>
                        {"IMDB: " +
                          String(
                            Math.round(movie.vote_average * 10) / 10 === 0 ||
                              Math.round(movie.vote_average * 10) / 10 ===
                                undefined ||
                              Math.round(movie.vote_average * 10) / 10 === null
                              ? "Not rated"
                              : Math.round(movie.vote_average * 10) / 10
                          )}
                      </p>
                    </div>
                    <p className="text-[4vw] tablet:text-[2.34vw] desktop:text-[1.25vw]">
                      {isMovieType(movie) ? movie.title : movie.name}
                    </p>
                  </div>
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() =>
                      handleBookmarkClick(
                        movie,
                        accessToken,
                        setBookmarkedItems,
                        movies
                      )
                    }
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
        {!isLoadingSkeleton ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.15, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={
              horizontalSection
                ? "hidden desktop:block absolute z-40 top-[6.6vw] right-[2.7vw] w-[1.56vw] h-auto opacity-50"
                : "hidden"
            }
            onClick={() =>
              scrollRight(scrollableRef, scrolling, setScrolling, timeoutRef)
            }
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
