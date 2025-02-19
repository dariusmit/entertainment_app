import { useContext, useEffect } from "react";
import { Context } from "../context/StoreContext";
import Search from "../components/Search";
import Header from "../components/Header";
import MoviesSection from "../components/MoviesSection";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PATHS } from "../axios/paths";
import { motion } from "framer-motion";

function HomePage() {
  const { searchCompleted, searchValue } = useContext(Context);
  const { user, isLoading } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

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
          <Search />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            {searchCompleted && searchValue && (
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
          </motion.div>
        </div>
      )}
    </>
  );
}

export default HomePage;
