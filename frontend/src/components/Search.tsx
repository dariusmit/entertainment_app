import { useContext, useEffect } from "react";
import { Context } from "../context/StoreContext";
import storeContextType from "../types/storeContextType";
import LoadingAnimatedItem from "./LoadingAnimatedItem";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Search() {
  const {
    searchValue,
    changeSearchValue,
    isLoadingAI,
    UpdateLoadingStatusAI,
    debouncedSearchValue,
    setSearchCompletion,
  } = useContext<storeContextType>(Context);

  const location = useLocation();

  function placeholderSelect(): string {
    switch (location.pathname) {
      case "/":
        return "Search for Movies or TV Series";
      case "/movies":
        return "Search for Movies";
      case "/shows":
        return "Search for TV Series";
      case "/bookmarks":
        return "Search in Bookmarks";
      default:
        break;
    }
    return "";
  }

  useEffect(() => {
    if (searchValue != "") {
      UpdateLoadingStatusAI(true);
    } else {
      setTimeout(() => UpdateLoadingStatusAI(false), 1000);
    }
  }, [searchValue]);

  useEffect(() => {
    if (searchValue !== "") {
      setSearchCompletion(true);
      UpdateLoadingStatusAI(false);
    } else {
      setSearchCompletion(false);
    }
  }, [debouncedSearchValue]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="flex px-[4.27vw] items-center tablet:px-[3.26vw] desktop:pl-[10vw] desktop:pr-0 desktop:mt-[3.3vw]"
      >
        <img
          className="mr-[4.27vw] tablet:mr-[2vw]"
          src="../../assets/icon-search.svg"
        />
        <input
          className="w-[70%] bg-[#10141E] text-gray-500 p-2 text-[4.27vw] font-light border-b-2 border-b-transparent tablet:text-[3.1vw] desktop:text-[1.67vw] focus:border-b-2 desktop:w-[90%] focus:border-[#5A698F] caret-[#FC4747]"
          type="text"
          onFocus={(event) => {
            event.target.setAttribute("autocomplete", "off");
          }}
          name="search"
          value={searchValue}
          onChange={(e) => changeSearchValue(e.target.value)}
          placeholder={placeholderSelect()}
        />
        {isLoadingAI && (
          <div className="ml-4">
            <LoadingAnimatedItem />
          </div>
        )}
      </motion.div>
    </>
  );
}

export default Search;
