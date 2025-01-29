import { Context } from "../context/storeContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import movieType from "../types/movieType";
import seriesType from "../types/seriesType";
import { getContentGetReq, getContentPostReq } from "../resources/functions";
import LoadingAnimatedItem from "./LoadingAnimatedItem";

interface Props {
  title: string;
  path: string;
  horizontalSection?: boolean;
}

function MoviesSection({ title, path, horizontalSection }: Props) {
  const { userID, debouncedSearchValue, PATHS } = useContext(Context);
  const [isLoading, changeLoadingStatus] = useState<boolean>(true);
  const [movies, updateMovies] = useState<movieType[] | seriesType[]>([]);
  const [bookmarks, updateBookmarks] = useState<any[]>(
    getBookmarksFromStorage()
  );
  const posterRootURL = "https://image.tmdb.org/t/p/original";

  function bookmarkContent(movie: movieType | seriesType, id: number): void {
    updateBookmarks((prev) => [...prev, movie]);
    if (!checkRecord(id)) {
      if (isMovieType(movie)) {
        axios
          .post("http://localhost:8081/bookmark_movie", { id, movies, userID })
          .then((res) => {
            console.log(res.data.message);
          })
          .catch((err) => console.log(err));
      } else {
        axios
          .post("http://localhost:8081/bookmark_series", { id, movies, userID })
          .then((res) => {
            console.log(res.data.message);
          })
          .catch((err) => console.log(err));
      }
    }
  }

  function removeBookmark(id: number): void {
    updateBookmarks((prev) => prev.filter((item) => item.id !== id));
    if (!checkRecord(id)) {
      axios
        .post("http://localhost:8081/remove_bookmarked_movie", { id, userID })
        .then((res) => {
          console.log(res.data.message);
        })
        .catch((err) => console.log(err));
    }
  }

  async function checkRecord(id: number): Promise<boolean | void> {
    return axios
      .post("http://localhost:8081/check_record", { id })
      .then((res) => {
        if (res.data.message === "exists") {
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => console.log(err));
  }

  //A type guard in TypeScript, which is used to narrow down a union type (trendingMovieType | originalsMovieType) to a specific type (trendingMovieType).
  //Without a type guard, TypeScript will throw errors if you try to access properties that don't exist on both types.
  //"is" - is type predicate, is a special syntax in TypeScript that informs the compiler about the type of a variable when a condition is true.
  function isMovieType(movie: movieType | seriesType): movie is movieType {
    return "release_date" in movie;
  }

  function chooseBookmarkImage(movie_id: number): string {
    //some method checks if any array elements pass a test and return boolean value
    const isBookmarked = bookmarks.some((bm) => bm.id === movie_id);
    if (isBookmarked) {
      return "../../assets/icon-bookmark-full.svg";
    } else {
      return "../../assets/icon-bookmark-empty.svg";
    }
  }

  function isBookmarked(movie_id: number): boolean {
    //some method checks if any array elements pass a test
    const isBookmarked = bookmarks.some((bm) => bm.id === movie_id);
    if (isBookmarked) {
      return true;
    } else {
      return false;
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
          updateMovies(await getContentPostReq(path, userID));
        } else {
          updateMovies(await getContentGetReq(path));
        }
        changeLoadingStatus(false);
      } catch (err: any) {
        console.log(err.message);
      }
    }
    updateContentState();
  }, [debouncedSearchValue]);

  function getBookmarksFromStorage(): any[] {
    return JSON.parse(localStorage.getItem("bookmarks") || "[]");
  }

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

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
                    onClick={() =>
                      isBookmarked(movie.id)
                        ? removeBookmark(movie.id)
                        : bookmarkContent(movie, movie.id)
                    }
                    className="absolute flex justify-center items-center top-0 right-0 m-1 w-[8.53vw] h-[8.53vw]"
                  >
                    <img
                      className="relative z-30"
                      src={chooseBookmarkImage(movie.id)}
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
