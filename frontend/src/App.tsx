import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from "./pages/NoPage";
import { Context } from "./context/storeContext";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import useDebounce from "./hooks/useDebounce";
import movieType from "./types/movieType";
import PATHS from "./resources/paths";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import IndividualItemPage from "./pages/IndividualItemPage";
import ShowsPage from "./pages/ShowsPage";
import BookmarksPage from "./pages/BookmarksPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [searchValue, changeSearchValue] = useState<string>("");
  const [isLoading, UpdateLoadingStatus] = useState<boolean | undefined>();
  const [searchError, setSearchError] = useState<string>("");
  const [userModal, setUserModal] = useState<boolean>(false);
  const [searchCompleted, setSearchCompletion] = useState<
    boolean | undefined
  >();
  const [userID, setUserID] = useState<number>(() => {
    return getUserIDFromStorage();
  });
  const [isLoggedIn, setLoggedInStatus] = useState<boolean>(() => {
    return getLoggedInStatus();
  });
  const [inputError, setInputError] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue);

  //Do I need these?
  const [movieList, updateMovieList] = useState<movieType[]>(() => {
    return getMoviesFromStorage();
  });
  const [bookmarkedMovies, setBookmarkedMovies] = useState<movieType[]>(() => {
    return getMoviesFromStorage();
  });
  //

  function getMoviesFromStorage(): movieType[] {
    return JSON.parse(localStorage.getItem("movie_list") || "[]");
  }

  function getUserIDFromStorage(): number {
    return JSON.parse(sessionStorage.getItem("user_id") || "0");
  }

  function getLoggedInStatus(): boolean {
    return JSON.parse(sessionStorage.getItem("logged_in_status") || "false");
  }

  function retreiveBookmarksFromDB(): void {
    axios
      .post("http://localhost:8081/retreive_bookmarked_movies", { userID })
      .then((res) => {
        let bookmarked_movies: string[] = [];
        for (let i = 0; i < res.data.results.length; i++) {
          bookmarked_movies.push(res.data.results[i].movie_title);
        }
        setBookmarkedMovies(
          movieList.filter((item: movieType) => {
            return bookmarked_movies.includes(item.title);
          })
        );
      })
      .catch((err: any) => {
        if (err) console.log(err.message);
      });
  }

  useEffect(() => {
    sessionStorage.setItem("logged_in_status", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    sessionStorage.setItem("user_id", JSON.stringify(userID));
  }, [userID]);

  return (
    <Context.Provider
      value={{
        movieList,
        retreiveBookmarksFromDB,
        updateMovieList,
        bookmarkedMovies,
        setBookmarkedMovies,
        searchValue,
        changeSearchValue,
        isLoading,
        UpdateLoadingStatus,
        searchError,
        setSearchError,
        searchCompleted,
        setSearchCompletion,
        isLoggedIn,
        setLoggedInStatus,
        inputError,
        setInputError,
        userModal,
        setUserModal,
        userID,
        setUserID,
        debouncedSearchValue,
        PATHS,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:slug" element={<IndividualItemPage />} />
          <Route path="/shows/:slug" element={<IndividualItemPage />} />
          <Route path="/shows" element={<ShowsPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
