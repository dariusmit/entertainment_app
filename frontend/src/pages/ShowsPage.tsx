import { useEffect, useContext } from "react";
import { Context } from "../context/storeContext";
import MoviesSection from "../components/MoviesSection";
import Search from "../components/Search";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

function ShowsPage() {
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
          path={`${PATHS.SearchSeries}&query=${searchValue}`}
        />
      )}
      {!searchCompleted && (
        <MoviesSection title="Series" path={PATHS.TrendingSeries} />
      )}
    </>
  );
}

export default ShowsPage;
