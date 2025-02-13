import { useContext, useEffect } from "react";
import { Context } from "../context/StoreContext";
import storeContextType from "../types/storeContextType";
import LoadingAnimatedItem from "./LoadingAnimatedItem";
import { useLocation } from "react-router-dom";

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
      <div className="flex px-[4.27vw] items-center tablet:px-[3.26vw] desktop:pl-[11.39vw] desktop:pr-0 desktop:mt-[4.44vw]">
        <img
          className="mr-[4.27vw] tablet:mr-[2.6vw]"
          src="../../assets/icon-search.svg"
        />
        <input
          className="w-[70%] bg-[#10141E] text-gray-500 p-2 text-[4.27vw] font-light tablet:text-[3.1vw] desktop:text-[1.67vw]"
          type="text"
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
      </div>
    </>
  );
}

export default Search;
