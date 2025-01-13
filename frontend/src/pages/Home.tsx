import { useEffect, useContext } from "react";
import movieType from "../types/movieType";
import { Context } from "../context/storeContext";
import MovieCard from "../components/MovieCard";
import Search from "../components/Search";
import Header from "../components/Header";

function Home() {
  const { isLoggedIn, getMovieList, filteredMovieList } = useContext(Context);

  useEffect(() => {
    getMovieList();
  }, []);

  return (
    <>
      <Header />
      <Search />
      <div className="px-[4.27vw] pb-[16.27vw]">
        <h1 className="font-bold text-xl mt-4 mb-2">Trending</h1>
        <div className="grid gap-3 grid-flow-col overflow-x-scroll">
          {filteredMovieList &&
            filteredMovieList.length != 0 &&
            filteredMovieList.map((movie: movieType) => {
              return (
                movie.isTrending && (
                  <div className="w-[64vw] h-[37.33vw] relative" key={movie.id}>
                    <img
                      className="rounded-lg"
                      src={`../.${movie.thumbnail.trending.small}`}
                    />
                    <p className="absolute bottom-0 left-0 p-4">
                      {movie.title}
                    </p>
                  </div>
                )
              );
            })}
        </div>
        <h1 className="font-bold text-xl mt-4 mb-2">Recommended for you</h1>
        <div className="grid grid-cols-2 gap-3">
          {filteredMovieList &&
            filteredMovieList.length != 0 &&
            filteredMovieList.map((movie: movieType) => {
              return (
                movie.isTrending === false && (
                  <MovieCard key={movie.id} movie={movie} />
                )
              );
            })}
        </div>
        {isLoggedIn && <p>User is Logged In!</p>}
      </div>
    </>
  );
}

export default Home;