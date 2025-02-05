import { Context } from "../context/storeContext";
import { useContext, useState, useEffect } from "react";
import { axiosJWT } from "../resources/functions";
import { config } from "../resources/functions";
import { motion } from "framer-motion";
import movieType from "../types/movieType";
import seriesType from "../types/seriesType";
import { getContentGetReq, getContentPostReq } from "../resources/functions";
import LoadingAnimatedItem from "./LoadingAnimatedItem";
import { useAxiosInterceptor } from "../resources/interceptor";

interface Props {
  title: string;
  path: string;
  horizontalSection?: boolean;
}

function MoviesSection({ title, path, horizontalSection }: Props) {
  const posterRootURL = "https://image.tmdb.org/t/p/original";

  const { debouncedSearchValue, PATHS, accessToken, setAccessToken } =
    useContext(Context);

  const [isLoading, changeLoadingStatus] = useState<boolean>(true);
  const [movies, updateMovies] = useState<movieType[] | seriesType[]>([]);
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([]);

  //A type guard in TypeScript, which is used to narrow down a union type to a specific type and prevent error about missing properties being thrown
  //"is" - is type predicate, is a special syntax in TypeScript that informs the compiler about the type of a variable when a condition is true.
  function isMovieType(movie: movieType | seriesType): movie is movieType {
    return "release_date" in movie;
  }

  async function fetchBookmarkedItems() {
    if (!accessToken) {
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
        setBookmarkedItems([
          ...movies.map((m: any) => m.id),
          ...series.map((s: any) => s.id),
        ]);
      }
    } catch (error) {
      console.error("Error fetching bookmarked items:", error);
    }
  }

  // Call this function in useEffect when the component mounts
  useEffect(() => {
    fetchBookmarkedItems();
  }, []);

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
    } else {
      await bookmarkContent(movie.id, mediaType);
    }
  }

  async function bookmarkContent(
    id: number,
    media_type: string
  ): Promise<void> {
    try {
      const res = await axiosJWT.post(
        "http://localhost:8081/bookmark_item",
        {
          id,
          movies,
          media_type,
        },
        config(accessToken)
      );
      console.log(res.data.message);
      setBookmarkedItems((prev) => [...prev, id]);
    } catch (err) {
      console.log("Error bookmarking:", err);
    }
  }

  async function removeBookmark(id: number, media_type: string): Promise<void> {
    try {
      const res = await axiosJWT.post(
        "http://localhost:8081/remove_bookmarked_item",
        {
          id,
          media_type,
        },
        config(accessToken)
      );
      console.log(res.data.message);
      setBookmarkedItems((prev) => prev.filter((item) => item !== id));
    } catch (err) {
      console.log("Error removing bookmark:", err);
    }
  }

  /** 
  function viewContent(): void {
    const formattedTitle = movie.title.replace(/\s+/g, "_").toLowerCase();

    if (location.pathname === "/") {
      navigate(
        `${
          movie.media_type === "movie" ? `/movies` : `/shows`
        }/${formattedTitle}`
      );
    } else if (location.pathname === "/bookmarks") {
      navigate(
        `${
          movie.media_type === "movie" ? `/movies` : `/shows`
        }/${formattedTitle}`
      );
    } else navigate(`${location.pathname}/${formattedTitle}`);
  }
  */

  useEffect(() => {
    async function updateContentState() {
      try {
        if (
          path === PATHS.RetreiveBookmarkedMovies ||
          path === PATHS.RetreiveBookmarkedSeries
        ) {
          updateMovies(await getContentPostReq(path, config(accessToken)));
        } else {
          updateMovies(await getContentGetReq(path));
        }
        changeLoadingStatus(false);
      } catch (err: any) {
        console.log(err.message);
      }
    }
    updateContentState();
  }, [debouncedSearchValue, bookmarkedItems]);

  return (
    <>
      <h1 className="font-light text-[5.33vw] mb-2 m-4">{title}</h1>
      {isLoading ? (
        <LoadingAnimatedItem />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={
            horizontalSection
              ? "grid gap-3 grid-flow-col overflow-x-scroll m-4"
              : "grid grid-cols-2 gap-3 m-4"
          }
        >
          {movies &&
            movies.length != 0 &&
            movies.map((movie: movieType | seriesType) => {
              return (
                <div
                  key={movie.id}
                  className={`${
                    horizontalSection ? `w-[64vw] h-auto` : ``
                  } relative overflow-hidden rounded-lg`}
                >
                  <img
                    className={`${
                      horizontalSection ? `h-full object-cover` : `h-auto`
                    } w-full rounded-lg transition-transform hover:scale-105 hover:cursor-pointer mb-2`}
                    src={posterRootURL + movie.poster_path}
                  />
                  <div className={horizontalSection ? "hidden" : ""}>
                    <div className="flex text-[3.47vw] font-extralight">
                      <p className="mr-[1.6vw]">
                        {isMovieType(movie)
                          ? String(movie.release_date).split("-")[0]
                          : String(movie.first_air_date).split("-")[0]}
                      </p>
                      <p className="mr-[1.6vw]">·</p>
                      <div className="flex items-center mr-[1.6vw]">
                        {isMovieType(movie) ? (
                          <>
                            <img
                              src="../../assets/icon-category-movie.svg"
                              className="w-[2.67vw] h-[2.67vw] mr-1"
                            />
                            <p>Movie</p>
                          </>
                        ) : (
                          <>
                            <img
                              src="../../assets/icon-category-tv.svg"
                              className="w-[2.67vw] h-[2.67vw] mr-1"
                            />
                            <p>Series</p>
                          </>
                        )}
                      </div>
                      <p className="mr-[1.6vw]">·</p>
                      <p>{String(Math.round(movie.vote_average * 10) / 10)}</p>
                    </div>
                    <p className="text-[4vw]">
                      {isMovieType(movie) ? movie.title : movie.name}
                    </p>
                  </div>
                  <div
                    onClick={() => handleBookmarkClick(movie)}
                    className="absolute flex justify-center items-center top-0 right-0 m-1 w-[8.53vw] h-[8.53vw]"
                  >
                    <img
                      className="relative z-10"
                      src={
                        bookmarkedItems.includes(movie.id)
                          ? "../../assets/icon-bookmark-full.svg"
                          : "../../assets/icon-bookmark-empty.svg"
                      }
                    />
                    <div className="bg-black absolute top-0 right-0 opacity-50 rounded-full w-[8.53vw] h-[8.53vw]"></div>
                  </div>
                </div>
              );
            })}
        </motion.div>
      )}
    </>
  );
}

export default MoviesSection;
