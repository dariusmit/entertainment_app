import { useEffect, useContext } from "react";
import movieType from "../types/movieType";
import { Context } from "../context/storeContext";
import MovieCard from "../components/MovieCard";
import Search from "../components/Search";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Bookmarks() {
  const {
    isLoggedIn,
    retreiveBookmarksFromDB,
    filteredMovieList,
    searchCompleted,
  } = useContext(Context);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      retreiveBookmarksFromDB();
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn]);

  return (
    <>
      <Header />
      <Search />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="px-[4.27vw] pb-[16.27vw]"
      >
        {!searchCompleted && (
          <h1 className="font-light text-[5.33vw] mt-4 mb-2">
            Bookmarked Movies
          </h1>
        )}
        <div className="grid grid-cols-2 gap-3">
          {filteredMovieList &&
            filteredMovieList.length != 0 &&
            filteredMovieList.map((movie: movieType) => {
              return (
                movie.category === "Movie" && (
                  <MovieCard key={movie.id} movie={movie} />
                )
              );
            })}
        </div>
        {!searchCompleted && (
          <h1 className="font-light text-[5.33vw] mt-4 mb-2">
            Bookmarked TV Series
          </h1>
        )}
        <div className="grid grid-cols-2 gap-3">
          {filteredMovieList &&
            filteredMovieList.length != 0 &&
            filteredMovieList.map((movie: movieType) => {
              return (
                movie.category === "TV Series" && (
                  <MovieCard key={movie.id} movie={movie} />
                )
              );
            })}
        </div>
      </motion.div>
    </>
  );
}

export default Bookmarks;
