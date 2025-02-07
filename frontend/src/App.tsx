import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from "./pages/NoPage";
import { useContext } from "react";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import IndividualItemPage from "./pages/IndividualItemPage";
import ShowsPage from "./pages/ShowsPage";
import BookmarksPage from "./pages/BookmarksPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useAxiosInterceptor } from "./axios/interceptor";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { accessToken, setAccessToken } = useContext(AuthContext);

  // Initialize the Axios interceptor
  useAxiosInterceptor(accessToken, setAccessToken);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/movies/:id/:slug" element={<IndividualItemPage />} />
        <Route path="/shows/:id/:slug" element={<IndividualItemPage />} />
        <Route path="/shows" element={<ShowsPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="*" element={<NoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
