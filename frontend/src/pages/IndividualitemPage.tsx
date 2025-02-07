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
import { API_KEY } from "../axios/paths";

interface genresType {
  id: number;
  name: string;
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

  useEffect(() => {
    if (match) {
      contentID = match[2];
    }
    const fetchContent = async () => {
      return await axios
        .get(
          `https://api.themoviedb.org/3/${
            location.pathname.includes("movies") ? "movie" : "tv"
          }/${contentID}?api_key=${API_KEY}`
        )
        .then((res) => {
          setGenres(res.data.genres);
          setContent(res.data);
          return res.data;
        })
        .catch((err) => console.log("Error: " + err.message));
    };
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
              className="w-full mb-[4.27vw] rounded-lg"
              src={posterRootURL + content.poster_path}
            />
            <div>
              <div className="flex text-[3.47vw] font-extralight">
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
                <p>{content.vote_average}</p>
              </div>
              <p className="text-[4vw]">
                {isMovieType(content) ? content.title : content.name}
              </p>
            </div>
            {genres &&
              genres.map((item: genresType) => {
                return <p key={item.id}>{item.name}</p>;
              })}
          </div>
        </>
      )}
    </>
  );
}

export default IndividualItemPage;
