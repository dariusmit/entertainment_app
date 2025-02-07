import { useContext, useEffect } from "react";
import { Context } from "../context/StoreContext";
import MoviesSection from "../components/MoviesSection";
import Search from "../components/Search";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ShowsPage() {
  const { searchCompleted, PATHS, searchValue } = useContext(Context);

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
          {searchCompleted && (
            <MoviesSection
              title="Search Results"
              path={`${PATHS.SearchSeries}&query=${searchValue}`}
            />
          )}
          {!searchCompleted && (
            <MoviesSection title="Series" path={PATHS.TrendingSeries} />
          )}
        </>
      )}
    </>
  );
}

export default ShowsPage;
