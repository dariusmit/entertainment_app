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
          <div></div>
          <Header />
          <div className="px-[4.27vw] pb-[16.27vw]" key={content.id}>
            <img
              className="w-full h-auto mb-1 rounded-lg"
              src={
                posterRootURL +
                `${content.backdrop_path || content.poster_path}`
              }
            />
            <div>
              <h1 className="text-[6vw] font-medium">
                {isMovieType(content) ? content.title : content.name}
              </h1>
              <div className="flex [3.47vw] font-extralight text-gray-400">
                <p className="mr-[1.6vw]">
                  {isMovieType(content)
                    ? content.release_date
                    : content.first_air_date}
                </p>
                <p className="mr-[1.6vw]">·</p>
                <div className="flex items-center mr-[1.6vw]">
                  <img
                    src={
                      isMovieType(content)
                        ? "../../assets/icon-category-movie.svg"
                        : "../../assets/icon-category-tv.svg"
                    }
                    className="w-[2.67vw] h-[2.67vw] mr-1"
                  />
                  <p>{isMovieType(content) ? "Movie" : "Series"}</p>
                </div>
                <p className="mr-[1.6vw]">·</p>
                <p>{String(Math.round(content.vote_average * 10) / 10)}</p>
              </div>
              <div className="flex text-[3.47vw] mb-3 font-extralight text-gray-400">
                {genres &&
                  genres.map((item: genresType) => {
                    return (
                      <p className="mr-2" key={item.id}>
                        • {item.name}
                      </p>
                    );
                  })}
              </div>
              <p className="mb-6">{content.overview}</p>
            </div>

            {contentVideos &&
              contentVideos.map((item) => {
                if (item.type === "Trailer") {
                  return (
                    <div key={item.key}>
                      <iframe
                        className="w-full h-[84vw] mb-4 rounded-lg"
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
