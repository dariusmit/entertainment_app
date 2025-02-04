import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from "./pages/NoPage";
import { Context } from "./context/storeContext";
import { useState } from "react";
import axios from "axios";
import useDebounce from "./hooks/useDebounce";
import PATHS from "./resources/paths";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import IndividualItemPage from "./pages/IndividualItemPage";
import ShowsPage from "./pages/ShowsPage";
import BookmarksPage from "./pages/BookmarksPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { jwtDecode } from "jwt-decode";

function App() {
  const [searchValue, changeSearchValue] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [isLoading, UpdateLoadingStatus] = useState<boolean | undefined>();
  const [searchError, setSearchError] = useState<string>("");
  const [userModal, setUserModal] = useState<boolean>(false);
  const axiosJWT = axios.create();
  const [searchCompleted, setSearchCompletion] = useState<
    boolean | undefined
  >();
  const [userID, setUserID] = useState<number>(0);
  const [isLoggedIn, setLoggedInStatus] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue);

  const renewToken = async () => {
    try {
      const res = await axios.post("http://localhost:8091/refreshtoken", {
        userID: userID,
      });
      setAccessToken(res.data.accessToken);
      setLoggedInStatus(res.data.isLoggedIn);
      return res.data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentTime = new Date();
      const decodedToken = jwtDecode(accessToken);
      if (decodedToken.exp! * 1000 < currentTime.getTime()) {
        const data = await renewToken();
        config.headers["Authorization"] = `Bearer ${data.accessToken}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  return (
    <Context.Provider
      value={{
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
        accessToken,
        setAccessToken,
        axiosJWT,
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
