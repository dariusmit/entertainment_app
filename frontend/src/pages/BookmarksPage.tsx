import { useEffect, useContext } from "react";
import movieType from "../types/movieType";
import { Context } from "../context/storeContext";
import MoviesSection from "../components/MoviesSection";
import Search from "../components/Search";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function BookmarksPage() {
  const {
    isLoggedIn,
    retreiveBookmarksFromDB,
    searchCompleted,
    searchValue,
    PATHS,
  } = useContext(Context);

  const navigate = useNavigate();

  /**
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      retreiveBookmarksFromDB();
    }
  }, []);
  */

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
        <MoviesSection title="Bookmarks" path={PATHS.TrendingMovies} />
      )}
    </>
  );
}

export default BookmarksPage;
