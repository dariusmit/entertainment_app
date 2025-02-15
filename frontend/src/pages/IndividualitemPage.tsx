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
import { posterRootURL } from "../helpers/posterRootURL";
import { API_KEY, LANG } from "../axios/paths";

interface genresType {
  id: number;
  name: string;
}

interface contentVideosType {
  key: string;
  type: string;
}

function IndividualItemPage() {
  const { user, isLoading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

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
  const [contentVideos, setContentVideos] = useState<contentVideosType[]>([]);

  useEffect(() => {
    if (match) {
      contentID = match[2];
    }

    const fetchVideos = async (): Promise<void> => {
      await axios
        .get(
          `https://api.themoviedb.org/3/${
            location.pathname.includes("movies") ? "movie" : "tv"
          }/${contentID}/videos?${API_KEY}&${LANG}`
        )
        .then((res) => {
          setContentVideos(res.data.results);
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
    fetchVideos();
    fetchContent();
  }, []);

  return (
    <>
      {user && (
        <>
          <Header />
          <div
            className="w-full px-4 mb-12 tablet:px-6 tablet:mb-16 desktop:ml-[10.5rem] desktop:mt-10 desktop:relative desktop:mr-4 desktop:mb-10 desktop:w-auto desktop:h-[90vh]"
            key={content.id}
          >
            <img
              className="w-full h-auto mb-1 rounded-xl desktop:mr-8 desktop:h-full"
              src={
                posterRootURL +
                `${content.backdrop_path || content.poster_path}`
              }
            />
            <div className="absolute bottom-4 left-16 z-40">
              <h1 className="text-2xl font-medium mb-2 desktop:text-5xl desktop:mb-8">
                {isMovieType(content) ? content.title : content.name}
              </h1>
              <div className="flex text-xs font-extralight text-gray-200 desktop:text-xl">
                <p className="mr-8">
                  {isMovieType(content)
                    ? content.release_date
                    : content.first_air_date}
                </p>
                <div className="flex items-center mr-8 mb-1">
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
                    String(Math.round(content.vote_average * 10) / 10)}
                </p>
              </div>
              <div className="flex text-xs mb-3 font-extralight text-gray-200 desktop:text-xl desktop:mb-6">
                {genres &&
                  genres.map((item: genresType) => {
                    return (
                      <p className="mr-6" key={item.id}>
                        • {item.name}
                      </p>
                    );
                  })}
              </div>
              <p className="text-base mb-6 font-extralight desktop:max-w-2xl desktop:text-xl">
                {content.overview}
              </p>
            </div>
            <div className="absolute bottom-0 left-6 z-10 w-[97.2%] gradient h-96 opacity-60"></div>
          </div>
          <div className="flex desktop:w-auto desktop:ml-48 desktop:mb-[3.25rem]">
            {contentVideos &&
              contentVideos.map((item) => {
                if (item.type === "Trailer") {
                  return (
                    <div key={item.key}>
                      <iframe
                        className="w-full h-[84vw] rounded-lg mr-4 desktop:w-[42.4vw] desktop:h-96 desktop:mr-10"
                        src={`https://www.youtube.com/embed/${item.key}`}
                      ></iframe>
                    </div>
                  );
                }
              })}
          </div>
        </>
      )}
    </>
  );
}

export default IndividualItemPage;
