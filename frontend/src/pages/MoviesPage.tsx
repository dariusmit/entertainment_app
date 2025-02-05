import { useContext, useEffect } from "react";
import { Context } from "../context/storeContext";
import MoviesSection from "../components/MoviesSection";
import Search from "../components/Search";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

function MoviesPage() {
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
      {isLoggedIn && (
        <>
          <Header />
          <Search />
          {searchCompleted && (
            <MoviesSection
              title="Search Results"
              path={`${PATHS.SearchMovies}&query=${searchValue}`}
            />
          )}
          {!searchCompleted && (
            <MoviesSection
              title="Action Movies"
              path={PATHS.ActionMovies}
              horizontalSection
            />
          )}
          {!searchCompleted && (
            <MoviesSection
              title="Comedy Movies"
              path={PATHS.ComedyMovies}
              horizontalSection
            />
          )}
          {!searchCompleted && (
            <MoviesSection
              title="Horror Movies"
              path={PATHS.HorrorMovies}
              horizontalSection
            />
          )}
          {!searchCompleted && (
            <MoviesSection
              title="Romance Movies"
              path={PATHS.RomanceMovies}
              horizontalSection
            />
          )}
          {!searchCompleted && (
            <MoviesSection
              title="Documentary Movies"
              path={PATHS.DocumentaryMovies}
              horizontalSection
            />
          )}
        </>
      )}
    </>
  );
}

export default MoviesPage;
