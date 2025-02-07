import { useContext, useEffect } from "react";
import { Context } from "../context/StoreContext";
import MoviesSection from "../components/MoviesSection";
import Search from "../components/Search";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function BookmarksPage() {
  const { searchCompleted, PATHS } = useContext(Context);

  const navigate = useNavigate();

  const { user, isLoading } = useContext(AuthContext);
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);
  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      {user && (
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
