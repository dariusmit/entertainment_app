import { useContext, useEffect } from "react";
import { Context } from "../context/StoreContext";
import MoviesSection from "../components/MoviesSection";
import Search from "../components/Search";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PATHS } from "../axios/paths";
import { motion } from "framer-motion";

function ShowsPage() {
  const { searchCompleted, searchValue } = useContext(Context);

  const navigate = useNavigate();

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

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
          <Search />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            {searchCompleted && (
              <MoviesSection
                title="Search Results"
                path={`${PATHS.SearchSeries}&query=${searchValue}`}
              />
            )}
            {!searchCompleted && (
              <MoviesSection title="Series" path={PATHS.TrendingSeries} />
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}

export default ShowsPage;
