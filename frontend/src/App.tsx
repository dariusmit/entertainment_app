import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Movies from "./pages/Movies";
import Shows from "./pages/Shows";
import Bookmarks from "./pages/Bookmarks";
import { Context } from "./context/storeContext";
import movieType from "./types/movieType";
import { useState, useMemo, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import axios from "axios";
import useDebounce from "./hooks/useDebounce";

function App() {
  const [movieList, updateMovieList] = useState<movieType[]>(() => {
    return getMoviesFromStorage();
  });
  const [searchValue, changeSearchValue] = useState<string>("");
  const [isLoading, UpdateLoadingStatus] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>("");
  const [userModal, setUserModal] = useState<boolean>(false);
  const [searchCompleted, setSearchCompletion] = useState<boolean>(false);
  const [userID, setUserID] = useState<number>(0);
  const [isLoggedIn, setLoggedInStatus] = useState<boolean>(() => {
    return getLoggedInStatus();
  });
  const [inputError, setInputError] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue);

  function getMoviesFromStorage(): movieType[] {
    return JSON.parse(localStorage.getItem("movie_list") || "[]");
  }

  function getLoggedInStatus(): boolean {
    return JSON.parse(sessionStorage.getItem("logged_in_status") || "false");
  }

  useEffect(() => {
    sessionStorage.setItem("logged_in_status", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const filteredMovieList = useMemo(() => {
    localStorage.setItem("movie_list", JSON.stringify(movieList));
    return movieList.filter((movie: movieType) => {
      if (searchValue !== "") {
        setSearchCompletion(true);
      } else {
        setSearchCompletion(false);
      }
      return movie.title.includes(searchValue);
    });
  }, [debouncedSearchValue, movieList]);

  function getMovieList(): void {
    if (movieList.length === 0) {
      const path = "./data.json";
      axios
        .get(path)
        .then((res: any) => {
          updateMovieList(res.data);
        })
        .catch((e: any) => {
          console.log("Error: " + e.message);
        });
    }
  }

  return (
    <Context.Provider
      value={{
        movieList,
        updateMovieList,
        getMovieList,
        searchValue,
        changeSearchValue,
        isLoading,
        UpdateLoadingStatus,
        searchError,
        setSearchError,
        searchCompleted,
        setSearchCompletion,
        filteredMovieList,
        isLoggedIn,
        setLoggedInStatus,
        inputError,
        setInputError,
        userModal,
        setUserModal,
        userID,
        setUserID,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
