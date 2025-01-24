import { useEffect, useContext, useState } from "react";
import movieType from "../types/movieType";
import { Context } from "../context/storeContext";
import MovieCard from "../components/MovieCard";
import Search from "../components/Search";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMemo } from "react";

function Bookmarks() {
  const {
    movieList,
    userID,
    isLoggedIn,
    getMovieList,
    setSearchCompletion,
    searchValue,
    debouncedSearchValue,
  } = useContext(Context);

  const navigate = useNavigate();

  const [bookmarkedMovies, setBookmarkedMovies] = useState<movieType[]>([]);

  const filteredBookmarkedMovies = useMemo(() => {
    return bookmarkedMovies.filter((movie: movieType) => {
      if (searchValue !== "") {
        setSearchCompletion(true);
      } else {
        setSearchCompletion(false);
      }
      return movie.title.includes(searchValue);
    });
  }, [debouncedSearchValue, bookmarkedMovies]);

  function retreiveBookmarkedMoviesFromDB() {
    axios
      .post("http://localhost:8081/retreive_bookmarked_movies", { userID })
      .then((res) => {
        let bookmarked_movies: string[] = [];
        for (let i = 0; i < res.data.results.length; i++) {
          bookmarked_movies.push(res.data.results[i].movie_title);
        }
        setBookmarkedMovies(
          movieList.filter((item: movieType) => {
            return bookmarked_movies.includes(item.title);
          })
        );
      })
      .catch((err: any) => {
        if (err) console.log(err.message);
      });
  }

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      getMovieList();
    }
    retreiveBookmarkedMoviesFromDB();
  }, []);

  useEffect(() => {
    retreiveBookmarkedMoviesFromDB();
  }, [movieList]);

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
        <h1 className="font-light text-[5.33vw] mt-4 mb-2">
          Bookmarked Movies
        </h1>
        <div className="grid grid-cols-2 gap-3">
          {filteredBookmarkedMovies &&
            filteredBookmarkedMovies.length != 0 &&
            filteredBookmarkedMovies.map((movie: movieType) => {
              return (
                movie.category === "Movie" && (
                  <MovieCard key={movie.id} movie={movie} />
                )
              );
            })}
        </div>
        <h1 className="font-light text-[5.33vw] mt-4 mb-2">
          Bookmarked TV Series
        </h1>
        <div className="grid grid-cols-2 gap-3">
          {filteredBookmarkedMovies &&
            filteredBookmarkedMovies.length != 0 &&
            filteredBookmarkedMovies.map((movie: movieType) => {
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
