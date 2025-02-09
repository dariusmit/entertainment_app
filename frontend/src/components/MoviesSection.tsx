import { Context } from "../context/StoreContext";
import { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import LoadingAnimatedItem from "./LoadingAnimatedItem";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  path: string;
  reqType?: string;
  horizontalSection?: boolean;
}

function MoviesSection({ title, path, reqType, horizontalSection }: Props) {
  const navigate = useNavigate();

  const { debouncedSearchValue, searchValue, searchCompleted } =
    useContext(Context);

  const { isLoading, accessToken } = useContext(AuthContext);

  const [isLoadingAI, changeLoadingStatusAI] = useState<boolean>(true);
  const [movies, updateMovies] = useState<movieType[] | seriesType[]>([]);
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

  useEffect(() => {
    if (isLoading || !accessToken) return;
    fetchBookmarkedItems();
  }, [isLoading, accessToken]);

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
      location.reload();
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
    if (isLoading) return;
    if (!accessToken) {
      console.log("Access token not available yet");
      return;
    }
    async function updateContentState() {
      try {
        let data: movieType[] | seriesType[];
        if (reqType === "auth") {
          data = (await getContentPostReq(path, config(accessToken))) as
            | movieType[]
            | seriesType[];
        } else {
          data = (await getContentGetReq(path)) as movieType[] | seriesType[];
        }

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

  return (
    <>
      <h1 className="font-light text-[5.33vw] mb-2 m-4">
        {searchCompleted
          ? `Found ${movies.length} results for '${searchValue}'`
          : title}
      </h1>
      {isLoadingAI ? (
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
                    onClick={() => viewContent(movie)}
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
