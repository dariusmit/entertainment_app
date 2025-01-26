import { Context } from "../context/storeContext";
import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import movieType from "../types/movieType";
import seriesType from "../types/seriesType";

interface Props {
  movie: movieType | seriesType;
  trendingCard?: boolean;
}

function MovieCard({ movie, trendingCard }: Props) {
  const { updateMovieList, userID } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  function addBookmarkToDB(): void {
    axios
      .post("http://localhost:8081/bookmark", { movie, userID })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }

  function removeBookmarkFromDB(): void {
    axios
      .post("http://localhost:8081/remove_bookmark", { movie, userID })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }

  /** 
  function bookmark(movie_id: number): void {
    updateMovieList((prev) =>
      prev.map((item) => {
        if (item.id === movie_id) {
          if (item.isBookmarked === false) {
            addBookmarkToDB();
            return { ...movie, isBookmarked: true };
          } else {
            removeBookmarkFromDB();
            return { ...movie, isBookmarked: false };
          }
        }
        return item;
      })
    );
  }
    */
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

  //A type guard in TypeScript, which is used to narrow down a union type (trendingMovieType | originalsMovieType) to a specific type (trendingMovieType).
  //Without a type guard, TypeScript will throw errors if you try to access properties that don't exist on both types.
  //"is" - is type predicate, is a special syntax in TypeScript that informs the compiler about the type of a variable when a condition is true.
  function isMovieType(movie: movieType | seriesType): movie is movieType {
    return "release_date" in movie;
  }

  const posterRootURL = "https://image.tmdb.org/t/p/original";

  return (
    <div
      className={`${
        trendingCard ? `w-[64vw] h-[37.33vw]` : ``
      } relative overflow-hidden rounded-lg`}
    >
      <img
        className={`${
          trendingCard ? `h-full` : `h-auto`
        } w-full rounded-lg transition-transform hover:scale-105 hover:cursor-pointer mb-2`}
        src={posterRootURL + movie.poster_path}
      />
      <div className={trendingCard ? "absolute bottom-0 left-0 p-2" : ""}>
        <div className="flex text-[3.47vw] font-extralight">
          <p className="mr-[1.6vw]">
            {isMovieType(movie) ? movie.release_date : movie.first_air_date}
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
          <p>{Math.round(movie.vote_average * 100) / 100}</p>
        </div>
        <p className="text-[4vw]">
          {isMovieType(movie) ? movie.title : movie.name}
        </p>
      </div>
      <div className="absolute flex justify-center items-center top-0 right-0 m-1 w-[8.53vw] h-[8.53vw]">
        <div className="bg-black absolute top-0 right-0 opacity-50 rounded-full w-[8.53vw] h-[8.53vw]">
          {" "}
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
