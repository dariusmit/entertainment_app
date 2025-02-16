import { useContext, useEffect } from "react";
import { Context } from "../context/StoreContext";
import MoviesSection from "../components/MoviesSection";
import Search from "../components/Search";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PATHS } from "../axios/paths";

function BookmarksPage() {
  const { searchCompleted, searchValue, isSearchVisible } = useContext(Context);

  const navigate = useNavigate();

  const { user, isLoading } = useContext(AuthContext);
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  return (
    <>
      {user && (
        <div className="desktop:mb-11">
          <Header />
          {isSearchVisible ? (
            <Search />
          ) : (
            <p className="ml-4">No bookmarked content found...</p>
          )}
          {searchCompleted && (
            <MoviesSection
              title="Search Results"
              path={`${PATHS.SearchBookmarks}?search=${searchValue}`}
              reqType="auth"
            />
          )}
          {!searchCompleted && (
            <MoviesSection
              title="Bookmarked Movies"
              path={`${PATHS.RetreiveBookmarkedMovies}`}
              reqType="auth"
            />
          )}
          {!searchCompleted && (
            <MoviesSection
              title="Bookmarked Series"
              path={`${PATHS.RetreiveBookmarkedSeries}`}
              reqType="auth"
            />
          )}
        </div>
      )}
    </>
  );
}

export default BookmarksPage;
