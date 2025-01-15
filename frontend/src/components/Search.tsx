import { useContext, useEffect } from "react";
import { Context } from "../context/storeContext";
import storeContextType from "../types/storeContextType";
import LoadingAnimatedItem from "./LoadingAnimatedItem";

function Search() {
  const {
    searchValue,
    changeSearchValue,
    searchCompleted,
    isLoading,
    filteredMovieList,
    UpdateLoadingStatus,
    setSearchCompletion,
    searchError,
  } = useContext<storeContextType>(Context);

  useEffect(() => {
    if (searchValue != "") {
      UpdateLoadingStatus(true);
      setSearchCompletion(false);
    } else {
      setTimeout(() => UpdateLoadingStatus(false), 1000);
    }
  }, [searchValue]);

  return (
    <>
      <div className="flex px-[4.27vw] items-center">
        <img className="mr-[4.27vw]" src="../../assets/icon-search.svg" />
        <input
          className="w-[70%] bg-[#10141E] text-gray-500 p-2"
          type="text"
          name="search"
          value={searchValue}
          onChange={(e) => changeSearchValue(e.target.value)}
          placeholder="Search for movies or TV series"
        />
        {isLoading && !searchCompleted && (
          <div className="ml-4">
            <LoadingAnimatedItem />
          </div>
        )}
      </div>
      <h1 className="pl-[4.27vw] mt-[4.27vw]">
        {searchCompleted &&
          `Found ${filteredMovieList.length} results for \'${searchValue}\'`}
      </h1>
      <p className="text-red-500 px-[4.27vw] mt-[4.27vw]"> {searchError}</p>
    </>
  );
}

export default Search;
