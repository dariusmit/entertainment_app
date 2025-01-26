import { useEffect, useContext } from "react";
import movieType from "../types/movieType";
import seriesType from "../types/seriesType";
import { Context } from "../context/storeContext";
import MovieCard from "../components/MovieCard";
import Search from "../components/Search";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

function Home() {
  const {
    isLoggedIn,
    searchCompleted,
    trendingMovies,
    updateTendingMovies,
    topRatedMovies,
    updateTopRatedMovies,
    getContent,
    PATHS,
    trendingSeries,
    updateTrendingSeries,
  } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      async function updateContentState() {
        try {
          updateTendingMovies(await getContent(PATHS.TrendingMovies));
          updateTrendingSeries(await getContent(PATHS.TrendingSeries));
          updateTopRatedMovies(await getContent(PATHS.TopRatedMovies));
        } catch (err: any) {
          console.log(err.message);
        }
      }
      updateContentState();
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
      <div className="px-[4.27vw] pb-[16.27vw]">
        {!searchCompleted && (
          <h1 className="font-light text-[5.33vw] mt-4 mb-2">
            Trending Movies
          </h1>
        )}
        <div className="grid gap-3 grid-flow-col overflow-x-scroll">
          {trendingMovies &&
            trendingMovies.length != 0 &&
            trendingMovies.map((movie: movieType) => {
              return <MovieCard key={movie.id} movie={movie} trendingCard />;
            })}
        </div>
        {!searchCompleted && (
          <h1 className="font-light text-[5.33vw] mt-4 mb-2">
            Trending Series
          </h1>
        )}
        <div className="grid grid-cols-2 gap-3">
          {trendingSeries &&
            trendingSeries.length != 0 &&
            trendingSeries.map((movie: seriesType) => {
              return <MovieCard key={movie.id} movie={movie} />;
            })}
        </div>
        {!searchCompleted && (
          <h1 className="font-light text-[5.33vw] mt-4 mb-2">
            Top Rated Movies
          </h1>
        )}
        <div className="grid grid-cols-2 gap-3">
          {topRatedMovies &&
            topRatedMovies.length != 0 &&
            topRatedMovies.map((movie: movieType) => {
              return <MovieCard key={movie.id} movie={movie} />;
            })}
        </div>
      </div>
    </>
  );
}

export default Home;
