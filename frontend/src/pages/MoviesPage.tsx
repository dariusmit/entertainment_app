import { useContext, useEffect } from "react";
import { Context } from "../context/StoreContext";
import MoviesSection from "../components/MoviesSection";
import Search from "../components/Search";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PATHS } from "../axios/paths";
import { motion } from "framer-motion";

function MoviesPage() {
  const { searchCompleted, searchValue } = useContext(Context);

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
        <div className="desktop:mb-[3.35rem]">
          <Header />
          <Search />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
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
          </motion.div>
        </div>
      )}
    </>
  );
}

export default MoviesPage;
