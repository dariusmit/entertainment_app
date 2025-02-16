import { useContext, useEffect } from "react";
import { Context } from "../context/StoreContext";
import Search from "../components/Search";
import Header from "../components/Header";
import MoviesSection from "../components/MoviesSection";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PATHS } from "../axios/paths";

function HomePage() {
  const { searchCompleted, searchValue } = useContext(Context);
  const { user, isLoading } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      {user && (
        <div className="desktop:mb-11">
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
            <MoviesSection
              title="Trending Series"
              path={PATHS.TrendingSeries}
            />
          )}
          {!searchCompleted && (
            <MoviesSection
              title="Top Rated Movies"
              path={PATHS.TopRatedMovies}
            />
          )}
        </div>
      )}
    </>
  );
}

export default HomePage;
