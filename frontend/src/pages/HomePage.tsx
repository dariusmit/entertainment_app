import { useEffect, useContext } from "react";
import { Context } from "../context/storeContext";
import Search from "../components/Search";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import MoviesSection from "../components/MoviesSection";

function HomePage() {
  const { isLoggedIn, searchCompleted, PATHS, searchValue } =
    useContext(Context);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn]);

  return (
    <>
      <Header />
      <Search />
      {searchCompleted && (
        <MoviesSection
          title="Search Results"
          path={`${PATHS.SearchAll}&query=${searchValue}`}
        />
      )}
      {!searchCompleted && (
        <MoviesSection
          title="Trending Movies"
          path={PATHS.TrendingMovies}
          horizontalSection
        />
      )}
      {!searchCompleted && (
        <MoviesSection title="Trending Series" path={PATHS.TrendingSeries} />
      )}
      {!searchCompleted && (
        <MoviesSection title="Top Rated Movies" path={PATHS.TopRatedMovies} />
      )}
    </>
  );
}

export default HomePage;
