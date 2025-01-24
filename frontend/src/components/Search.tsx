import { useContext, useEffect, useState } from "react";
import { Context } from "../context/storeContext";
import storeContextType from "../types/storeContextType";
import LoadingAnimatedItem from "./LoadingAnimatedItem";
import { useLocation } from "react-router-dom";

function Search() {
  const {
    searchValue,
    changeSearchValue,
    searchCompleted,
    isLoading,
    filteredMovieList,
    UpdateLoadingStatus,
    searchError,
    debouncedSearchValue,
  } = useContext<storeContextType>(Context);

  const [foundValues, setFoundValues] = useState<number>();

  const location = useLocation();

  useEffect(() => {
    if (searchValue != "") {
      UpdateLoadingStatus(true);
    } else {
      setTimeout(() => UpdateLoadingStatus(false), 1000);
    }
  }, [searchValue]);

  function countFoundValues(): void {
    if (location.pathname === "/") {
      setFoundValues(filteredMovieList.length);
    } else if (location.pathname === "/movies") {
      for (let i = 0; i < filteredMovieList.length; i++) {
        if (filteredMovieList[i].category === "Movie") {
          setFoundValues(i);
        }
      }
    } else if (location.pathname === "/shows") {
      for (let i = 0; i < filteredMovieList.length; i++) {
        if (filteredMovieList[i].category === "TV Series") {
          setFoundValues(i);
        }
      }
    }
  }

  useEffect(() => {
    countFoundValues();
  }, [debouncedSearchValue]);

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
          placeholder="Search for movies or TV series"
        />
        {isLoading && (
          <div className="ml-4">
            <LoadingAnimatedItem />
          </div>
        )}
      </div>
      {searchCompleted && (
        <h1 className="pl-[4.27vw] mt-[4.27vw] font-light text-[5.33vw]">
          Found {foundValues} results for '{searchValue}'
        </h1>
      )}
      <p className="text-red-500 px-[4.27vw] mt-[4.27vw]"> {searchError}</p>
    </>
  );
}

export default Search;
