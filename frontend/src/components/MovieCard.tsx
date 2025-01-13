import movieType from "../types/movieType";
import { Context } from "../context/storeContext";
import { useContext } from "react";

interface Props {
  movie: movieType;
}

function MovieCard({ movie }: Props) {
  const { updateMovieList } = useContext(Context);

  function bookmark(movie_id: number) {
    updateMovieList((prev) =>
      prev.map((item) => {
        if (item.id === movie_id) {
          if (item.isBookmarked === false) {
            return { ...movie, isBookmarked: true };
          } else {
            return { ...movie, isBookmarked: false };
          }
        }
        return item;
      })
    );
  }

  return (
    <div className="relative">
      <img
        className="w-full h-auto rounded-lg"
        src={`../.${movie.thumbnail.regular.small}`}
      />
      <div>
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
