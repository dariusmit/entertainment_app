import { useContext, useEffect, useState } from "react";
import { Context } from "../context/StoreContext";
import MoviesSection from "../components/MoviesSection";
import Search from "../components/Search";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PATHS } from "../axios/paths";
import { motion } from "framer-motion";
import { axiosJWT, config } from "../axios/axios";

function BookmarksPage() {
  const { searchCompleted, searchValue, isSearchVisible } = useContext(Context);
  const { accessToken } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const { user, isLoading } = useContext(AuthContext);
  useEffect(() => {
    checkIfNoRecords();
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  const [bothEmpty, setBothEmpty] = useState<boolean | null>(null);

  async function checkIfNoRecords() {
    if (isLoading || !accessToken) {
      console.error("Access token not yet available!");
      return;
    }
    try {
      const res = await axiosJWT.post(
        "http://localhost:8081/get_bookmarked_items",
        {},
        config(accessToken)
      );

      if (res.data) {
        const { movies, series } = res.data;
        if (movies.length === 0 && series.length === 0) {
          setBothEmpty(true);
        } else {
          setBothEmpty(false);
        }
      }
    } catch (error) {
      console.error("Error checking:", error);
    }
  }

  return (
    <>
      {user && (
        <div className="desktop:mb-11">
          <Header />
          {isSearchVisible && <Search />}
          {bothEmpty ? (
            <p className="mx-4 tablet:mx-[3.25vw] tablet:text-xl desktop:mx-[10vw] desktop:mt-[3.3vw]">
              No bookmarked content found...
            </p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
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
            </motion.div>
          )}
        </div>
      )}
    </>
  );
}

export default BookmarksPage;
