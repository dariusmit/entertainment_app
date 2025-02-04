import { useContext, useEffect } from "react";
import { Context } from "../context/storeContext";
import MoviesSection from "../components/MoviesSection";
import Search from "../components/Search";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

function BookmarksPage() {
  const { isLoggedIn, searchCompleted, PATHS } = useContext(Context);

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
          {!searchCompleted && (
            <MoviesSection
              title="Bookmarked Movies"
              path={`${PATHS.RetreiveBookmarkedMovies}`}
            />
          )}
          {!searchCompleted && (
            <MoviesSection
              title="Bookmarked Series"
              path={`${PATHS.RetreiveBookmarkedSeries}`}
            />
          )}
        </>
      )}
    </>
  );
}

export default BookmarksPage;
