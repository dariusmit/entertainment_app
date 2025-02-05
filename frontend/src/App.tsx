import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from "./pages/NoPage";
import { Context } from "./context/storeContext";
import { useState } from "react";
import useDebounce from "./hooks/useDebounce";
import PATHS from "./resources/paths";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import IndividualItemPage from "./pages/IndividualItemPage";
import ShowsPage from "./pages/ShowsPage";
import BookmarksPage from "./pages/BookmarksPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useAxiosInterceptor } from "./resources/interceptor";

function App() {
  const [searchValue, changeSearchValue] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [isLoading, UpdateLoadingStatus] = useState<boolean | undefined>();
  const [searchError, setSearchError] = useState<string>("");
  const [userModal, setUserModal] = useState<boolean>(false);
  const [searchCompleted, setSearchCompletion] = useState<
    boolean | undefined
  >();
  const [isLoggedIn, setLoggedInStatus] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue);

  // Initialize the Axios interceptor
  useAxiosInterceptor(accessToken, setAccessToken);

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
        debouncedSearchValue,
        PATHS,
        accessToken,
        setAccessToken,
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
