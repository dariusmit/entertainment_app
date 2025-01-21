import movieType from "../types/movieType";
import { Context } from "../context/storeContext";
import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface Props {
  movie: movieType;
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

  function viewContent(): void {
    const formattedTitle = movie.title.replace(/\s+/g, "_").toLowerCase();

    if (location.pathname === "/") {
      navigate(
        `${movie.category === "Movie" ? `/movies` : `/shows`}/${formattedTitle}`
      );
    } else if (location.pathname === "/bookmarks") {
      navigate(
        `${movie.category === "Movie" ? `/movies` : `/shows`}/${formattedTitle}`
      );
    } else navigate(`${location.pathname}/${formattedTitle}`);
  }

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
        onClick={() => viewContent()}
        src={`../.${movie.thumbnail.regular.small}`}
      />
      <div className={trendingCard ? "absolute bottom-0 left-0 p-2" : ""}>
        <div className="flex">
          <p className="mr-[1.6vw]">{movie.year}</p>
          <p className="mr-[1.6vw]">·</p>
          <div className="flex items-center mr-[1.6vw]">
            <img
              src={
                movie.category === "Movie"
                  ? "../../assets/icon-category-movie.svg"
                  : "../../assets/icon-category-tv.svg"
              }
              className="w-[2.67vw] h-[2.67vw] mr-1"
            />
            <p>{movie.category}</p>
          </div>
          <p className="mr-[1.6vw]">·</p>
          <p>{movie.rating}</p>
        </div>
        <p>{movie.title}</p>
      </div>
      <div className="absolute flex justify-center items-center top-0 right-0 m-1 w-[8.53vw] h-[8.53vw]">
        <div className="bg-black absolute top-0 right-0 opacity-50 rounded-full w-[8.53vw] h-[8.53vw]">
          {" "}
        </div>
        <img
          src={
            movie.isBookmarked
              ? "../../assets/icon-bookmark-full.svg"
              : "../../assets/icon-bookmark-empty.svg"
          }
          onClick={() => bookmark(movie.id)}
          className="relative w-[3.11vw] h-[3.73vw]"
        />
      </div>
    </div>
  );
}

export default MovieCard;
