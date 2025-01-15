import { useContext } from "react";
import { Context } from "../context/storeContext";
import storeContextType from "../types/storeContextType";

function Search() {
  const {
    searchValue,
    changeSearchValue,
    searchCompleted,
    filteredMovieList,
    searchError,
  } = useContext<storeContextType>(Context);

  return (
    <>
      <div className="flex px-[4.27vw] items-center">
        <img className="mr-[4.27vw]" src="../../assets/icon-search.svg" />
        <input
          className="w-full bg-[#10141E] text-gray-500 p-2"
          type="text"
          name="search"
          value={searchValue}
          onChange={(e) => changeSearchValue(e.target.value)}
          placeholder="Search for movies or TV series"
        />
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
