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
  /**
  const [bookmarks, updateBookmarks] = useState<any[]>(
    getBookmarksFromStorage()
  );
   */
  const posterRootURL = "https://image.tmdb.org/t/p/original";

  //A type guard in TypeScript, which is used to narrow down a union type (trendingMovieType | originalsMovieType) to a specific type (trendingMovieType).
  //Without a type guard, TypeScript will throw errors if you try to access properties that don't exist on both types.
  //"is" - is type predicate, is a special syntax in TypeScript that informs the compiler about the type of a variable when a condition is true.
  function isMovieType(movie: movieType | seriesType): movie is movieType {
    return "release_date" in movie;
  }

  function chooseBookmarkImage(movie: movieType | seriesType): string {
    const [isBookmarkedState, setIsBookmarkedState] = useState<
      boolean | null | void
    >(null);

    useEffect(() => {
      async function fetchBookmarkStatus() {
        const result = await isBookmarked(
          movie.id,
          isMovieType(movie) ? "movie" : "series"
        );
        setIsBookmarkedState(result);
      }

      fetchBookmarkStatus();
    }, [movie]);

    const bookmarkSrc = isBookmarkedState
      ? "../../assets/icon-bookmark-full.svg"
      : "../../assets/icon-bookmark-empty.svg";

    return bookmarkSrc;
  }
  /**
  function isBookmarked(movie_id: number): boolean {
    //some method checks if any array elements pass a test
    //Reikia jungtis prie DB ir ziureti ar yra duombazej
    //const isBookmarked = bookmarks.some((bm) => bm.id === movie_id);

    return false;
  }
 */

  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([]);

  async function isBookmarked(
    id: number,
    media_type: string
  ): Promise<boolean> {
    try {
      const res = await axios.post("http://localhost:8081/is_bookmarked", {
        userID,
        id,
        media_type,
      });

      return typeof res.data.isBookmarked === "boolean"
        ? res.data.isBookmarked
        : false;
    } catch (error) {
      console.error("Error checking bookmark status:", error);
      return false;
    }
  }

  async function handleBookmarkClick(movie: movieType | seriesType) {
    const mediaType = isMovieType(movie) ? "movie" : "series";
    const isBookmarkedStatus = await isBookmarked(movie.id, mediaType);

    if (isBookmarkedStatus) {
      await removeBookmark(movie.id, mediaType);
    } else {
      await bookmarkContent(movie, movie.id, mediaType);
    }
  }

  async function bookmarkContent(
    movie: movieType | seriesType,
    id: number,
    media_type: string
  ) {
    try {
      const res = await axios.post("http://localhost:8081/bookmark_item", {
        id,
        userID,
        movies,
        media_type,
      });
      console.log(res.data.message);
      setBookmarkedItems((prev) => [...prev, id]); // Add to bookmarked state
    } catch (err) {
      console.log("Error bookmarking:", err);
    }
  }

  async function removeBookmark(id: number, media_type: string) {
    try {
      const res = await axios.post(
        "http://localhost:8081/remove_bookmarked_item",
        {
          id,
          userID,
          media_type,
        }
      );

      console.log(res.data.message);
      setBookmarkedItems((prev) => prev.filter((item) => item !== id)); // Remove from bookmarked state
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
          updateMovies(await getContentPostReq(path, userID));
          //updateBookmarks(await getContentPostReq(path, userID));
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

  /**
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);
  */

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
                      className="relative z-30"
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
