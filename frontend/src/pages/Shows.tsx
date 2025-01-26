import { useEffect, useContext } from "react";
import { Context } from "../context/storeContext";
import MovieCard from "../components/MovieCard";
import Search from "../components/Search";
import Header from "../components/Header";
import seriesType from "../types/seriesType";
import { useNavigate } from "react-router-dom";

function Shows() {
  const {
    isLoggedIn,
    trendingSeries,
    updateTrendingSeries,
    searchCompleted,
    getContent,
    PATHS,
  } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      async function updateContentState() {
        try {
          updateTrendingSeries(await getContent(PATHS.TrendingSeries));
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
      </div>
    </>
  );
}

export default Shows;
