import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Movies from "./pages/Movies";
import Shows from "./pages/Shows";
import Bookmarks from "./pages/Bookmarks";
import { Context } from "./context/storeContext";
import movieType from "./types/movieType";
import { useState, useMemo } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [movieList, updateMovieList] = useState<movieType[]>(() => {
    return getMoviesFromStorage();
  });
  const [searchValue, changeSearchValue] = useState<string>("");
  const [isLoading, UpdateLoadingStatus] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>("");
  const [searchCompleted, setSearchCompletion] = useState<boolean>(false);
  const [isLoggedIn, setLoggedInStatus] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string>("");

  function getMoviesFromStorage(): movieType[] {
    return JSON.parse(localStorage.getItem("movie_list") || "[]");
  }

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
  }, [searchValue, movieList]);

  async function getMovieList(): Promise<void> {
    if (movieList.length === 0) {
      const path = "./data.json";
      try {
        const req = await fetch(path);
        const res = await req.json();
        updateMovieList(res);
      } catch (e: any) {
        console.log("Error: " + e.message);
      }
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
