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
    searchError,
  } = useContext<storeContextType>(Context);

  const location = useLocation();

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

  return (
    <>
      <div className="flex px-[4.27vw] items-center">
        <img className="mr-[4.27vw]" src="../../assets/icon-search.svg" />
        <input
          className="w-[70%] bg-[#10141E] text-gray-500 p-2 text-[4.27vw] font-light"
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
      <p className="text-red-500 px-[4.27vw] mt-[4.27vw]"> {searchError}</p>
    </>
  );
}

export default Search;
