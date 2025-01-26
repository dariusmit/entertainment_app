import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Movies from "./pages/Movies";
import Shows from "./pages/Shows";
import Bookmarks from "./pages/Bookmarks";
import { Context } from "./context/storeContext";
import { useState, useMemo, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import axios from "axios";
import useDebounce from "./hooks/useDebounce";
import IndividualItemPage from "./pages/IndividualitemPage";
import movieType from "./types/movieType";
import seriesType from "./types/seriesType";

function App() {
  const [movieList, updateMovieList] = useState<movieType[]>(() => {
    return getMoviesFromStorage();
  });
  const [bookmarkedMovies, setBookmarkedMovies] = useState<movieType[]>(() => {
    return getMoviesFromStorage();
  });
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
  const list_to_filter =
    window.location.pathname === "/bookmarks" ? bookmarkedMovies : movieList;

  const filteredMovieList = useMemo(() => {
    localStorage.setItem("movie_list", JSON.stringify(list_to_filter));
    return list_to_filter.filter((movie: movieType) => {
      if (searchValue !== "") {
        setSearchCompletion(true);
        UpdateLoadingStatus(false);
      } else {
        setSearchCompletion(false);
      }
      return movie.title.includes(searchValue);
    });
  }, [debouncedSearchValue, movieList, bookmarkedMovies]);

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

  const API_KEY = "api_key=fc3044a6adda941a338057c80a65b637";
  const BASE_URL = "https://api.themoviedb.org/3";
  const LANG = "language=en-US";
  const PATHS = {
    TrendingMovies: `${BASE_URL}/trending/movie/day?${API_KEY}&${LANG}`,
    TrendingSeries: `${BASE_URL}/discover/tv?${API_KEY}&${LANG}&sort_by=popularity.desc`,
    TopRatedMovies: `${BASE_URL}/movie/top_rated?${API_KEY}&${LANG}`,
    ActionMovies: `${BASE_URL}/discover/movie?${API_KEY}&${LANG}&with_genres=28`,
    ComedyMovies: `${BASE_URL}/discover/movie?${API_KEY}&${LANG}&with_genres=35`,
    HorrorMovies: `${BASE_URL}/discover/movie?${API_KEY}&${LANG}&with_genres=27`,
    RomanceMovies: `${BASE_URL}/discover/movie?${API_KEY}&${LANG}&with_genres=10749`,
    DocumentaryMovies: `${BASE_URL}/discover/movie?${API_KEY}&${LANG}&with_genres=99`,
  };

  const [trendingMovies, updateTendingMovies] = useState<movieType[]>([]);
  const [trendingSeries, updateTrendingSeries] = useState<seriesType[]>([]);
  const [topRatedMovies, updateTopRatedMovies] = useState<movieType[]>([]);
  const [actionMovies, updateActionMovies] = useState<movieType[]>([]);
  const [comedyMovies, updateComedyMovies] = useState<movieType[]>([]);
  const [horrorMovies, updateHorrorMovies] = useState<movieType[]>([]);
  const [romanceMovies, updateRomanceMovies] = useState<movieType[]>([]);
  const [documentaryMovies, updateDocumentaryMovies] = useState<movieType[]>(
    []
  );

  async function getContent(path: string): Promise<any> {
    return await axios
      .get(path)
      .then((res: any) => {
        return res.data.results;
      })
      .catch((e: any) => {
        console.log("Error: " + e.message);
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
        filteredMovieList,
        isLoggedIn,
        setLoggedInStatus,
        inputError,
        setInputError,
        userModal,
        setUserModal,
        userID,
        setUserID,
        debouncedSearchValue,
        trendingMovies,
        updateTendingMovies,
        topRatedMovies,
        updateTopRatedMovies,
        getContent,
        PATHS,
        trendingSeries,
        updateTrendingSeries,
        actionMovies,
        updateActionMovies,
        comedyMovies,
        updateComedyMovies,
        horrorMovies,
        updateHorrorMovies,
        romanceMovies,
        updateRomanceMovies,
        documentaryMovies,
        updateDocumentaryMovies,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:slug" element={<IndividualItemPage />} />
          <Route path="/shows/:slug" element={<IndividualItemPage />} />
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
