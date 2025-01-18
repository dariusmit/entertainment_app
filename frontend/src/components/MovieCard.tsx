import movieType from "../types/movieType";
import { Context } from "../context/storeContext";
import { useContext } from "react";
import axios from "axios";

interface Props {
  movie: movieType;
  styleGeneral?: string;
  styleInfoSection?: string;
  trendingCard?: boolean;
}

function MovieCard({
  movie,
  styleGeneral,
  styleInfoSection,
  trendingCard,
}: Props) {
  const { updateMovieList, userID } = useContext(Context);

  function addBookmarkToDB() {
    axios
      .post("http://localhost:8081/bookmark", { movie, userID })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }

  function removeBookmarkFromDB() {
    axios
      .post("http://localhost:8081/remove_bookmark", { movie, userID })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }

  function bookmark(movie_id: number) {
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

  return (
    <div className={trendingCard ? styleGeneral : "relative"}>
      <img
        className={
          trendingCard ? "w-full h-full rounded-lg" : "w-full h-auto rounded-lg"
        }
        src={`../.${movie.thumbnail.regular.small}`}
      />
      <div className={styleInfoSection}>
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
