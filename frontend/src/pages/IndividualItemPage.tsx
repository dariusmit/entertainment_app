import { useContext, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import movieType from "../types/movieType";
import seriesType from "../types/seriesType";
import { isMovieType } from "../helpers/isMovieType";
import axios from "axios";
import { API_KEY, LANG } from "../axios/paths";
import { motion } from "framer-motion";
import { Context } from "../context/StoreContext";
import {
  fetchBookmarkedItems,
  handleBookmarkClick,
} from "../components/bookmarks_functions/bookmarksFunctions";

interface genresType {
  id: number;
  name: string;
}

interface contentVideosType {
  key: string;
  type: string;
}

function IndividualItemPage() {
  const posterRootURL = "https://image.tmdb.org/t/p/original";
  const { user, isLoading, accessToken } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { bookmarkedItems, setBookmarkedItems, debouncedSearchValue } =
    useContext(Context);

  const [content, setContent] = useState<movieType | seriesType>(
    {} as movieType | seriesType
  );

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  //Get content ID from pathname
  const match = location.pathname.match(/^\/(movies|shows)\/(\d+)\/.*/);
  let contentID: string;

  const [genres, setGenres] = useState<genresType[]>([]);
  const [contentTrailers, setContentTrailers] = useState<contentVideosType[]>(
    []
  );

  useEffect(() => {
    if (match) {
      contentID = match[2];
    }

    const fetchTrailers = async (): Promise<void> => {
      window.scroll(0, 0);

      await axios
        .get(
          `https://api.themoviedb.org/3/${
            location.pathname.includes("movies") ? "movie" : "tv"
          }/${contentID}/videos?${API_KEY}&${LANG}`
        )
        .then((res) => {
          setContentTrailers(res.data.results);
        })
        .catch((err) => console.log("Error: " + err.message));
    };

    const fetchContent = async (): Promise<void> => {
      await axios
        .get(
          `https://api.themoviedb.org/3/${
            location.pathname.includes("movies") ? "movie" : "tv"
          }/${contentID}?${API_KEY}&${LANG}`
        )
        .then((res) => {
          setGenres(res.data.genres);
          setContent(res.data);
        })
        .catch((err) => console.log("Error: " + err.message));
    };

    fetchTrailers();
    fetchContent();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!accessToken) {
      console.log("Access token not available yet");
      return;
    }
    fetchBookmarkedItems(isLoading, accessToken, setBookmarkedItems);
  }, [isLoading, accessToken, debouncedSearchValue]);

  return (
    <>
      {user && (
        <>
          <Header />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <div
              className="w-full px-4 mb-8 tablet:px-[3.13vw] tablet:mb-12 desktop:ml-[10vw] desktop:px-0 desktop:mt-[2.1vw] desktop:relative desktop:mb-[2.1vw] desktop:w-[87.7vw] desktop:h-[89.9vh] desktopBig:w-[86.9vw]"
              key={content.id}
            >
              <img
                className="w-full h-auto mb-1 rounded-xl tablet:object-cover tablet:mb-4 desktop:mb-[2.1vw] desktop:h-full"
                src={
                  content.backdrop_path || content.poster_path
                    ? posterRootURL +
                      (content.backdrop_path || content.poster_path)
                    : `../../assets/img-placeholder.png`
                }
              />
              <div className="desktop:absolute desktop:bottom-[0.5vw] desktop:left-[2.8vw] desktop:z-40">
                <div className="flex w-full justify-between desktop:justify-start">
                  <h1 className="text-2xl font-medium mb-4 desktop:text-5xl desktop:mb-8 desktop:mr-8">
                    {isMovieType(content) ? content.title : content.name}
                  </h1>
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() =>
                      handleBookmarkClick(
                        content,
                        accessToken,
                        setBookmarkedItems,
                        [content]
                      )
                    }
                    className=" flex justify-center items-center relative m-1 w-[8.53vw] h-[8.53vw] tablet:w-[4.17vw] tablet:h-[4.17vw] tablet:m-3 desktop:w-[2.22vw] desktop:h-[2.22vw] [&>*]:desktop:hover:opacity-100 [&>div]:desktop:hover:border-2 [&>div]:desktop:hover:border-white desktop:cursor-pointer"
                  >
                    <img
                      className="relative z-10"
                      src={
                        bookmarkedItems.includes(content.id)
                          ? "../../assets/icon-bookmark-full.svg"
                          : "../../assets/icon-bookmark-empty.svg"
                      }
                    />
                    <div className="bg-black absolute top-0 right-0 opacity-50 rounded-full w-[8.53vw] h-[8.53vw] tablet:w-[4.17vw] tablet:h-[4.17vw] desktop:w-[2.22vw] desktop:h-[2.22vw]"></div>
                  </motion.div>
                </div>
                <div className="flex text-xs font-extralight text-gray-200 desktop:text-xl">
                  <p className="mr-4 desktop:mr-8">
                    {isMovieType(content)
                      ? content.release_date || "Unknown"
                      : content.first_air_date || "Unknown"}
                  </p>
                  <div className="flex items-center mr-4 desktop:mr-8 mb-1">
                    <img
                      src={
                        isMovieType(content)
                          ? "../../assets/icon-category-movie.svg"
                          : "../../assets/icon-category-tv.svg"
                      }
                      className="w-3 h-3 mr-1"
                    />
                    <p>{isMovieType(content) ? "Movie" : "Series"}</p>
                  </div>
                  <p>
                    {"IMDB: " +
                      String(
                        Math.round(content.vote_average * 10) / 10 === 0 ||
                          Math.round(content.vote_average * 10) / 10 ===
                            undefined ||
                          Math.round(content.vote_average * 10) / 10 === null
                          ? "Not rated"
                          : Math.round(content.vote_average * 10) / 10
                      )}
                  </p>
                </div>
                <div className="flex text-xs mb-3 font-extralight text-gray-200 desktop:text-xl desktop:mb-6">
                  {genres &&
                    genres.map((item: genresType) => {
                      return (
                        <p className="mr-4" key={item.id}>
                          • {item.name}
                        </p>
                      );
                    })}
                </div>
                <p className="text-base desktop:mb-6 font-extralight desktop:max-w-2xl desktop:text-xl">
                  {content.overview}
                </p>
              </div>
              <div className="hidden desktop:block rounded-xl absolute bottom-0 left-0 z-10 w-full gradient h-96 opacity-75"></div>
            </div>
            <div className="px-4 mb-12 grid grid-cols-1 w-full tablet:px-[3.08vw] gap-[5vw] desktop:grid-cols-2 desktop:gap-[2.1vw] desktop:w-[87vw] desktop:ml-[10vw] desktop:px-0 desktop:mb-[3.6vw] desktopBig:mt-[-0.3vw] desktopBig:mb-[2.7vw]">
              {contentTrailers &&
                contentTrailers.map((item) => {
                  if (item.type === "Trailer") {
                    return (
                      <div key={item.key}>
                        <iframe
                          className="w-full h-[64vw] rounded-lg tablet:h-[50vw] desktop:h-96"
                          src={`https://www.youtube.com/embed/${item.key}`}
                        ></iframe>
                      </div>
                    );
                  }
                })}
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}

export default IndividualItemPage;
