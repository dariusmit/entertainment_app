import pathsType from "../types/pathsType";

const API_KEY = "api_key=fc3044a6adda941a338057c80a65b637";
const BASE_URL = "https://api.themoviedb.org/3";
const LANG = "language=en-US";
const PATHS: pathsType = {
  TrendingMovies: `${BASE_URL}/trending/movie/day?${API_KEY}&${LANG}`,
  TrendingSeries: `${BASE_URL}/discover/tv?${API_KEY}&${LANG}&sort_by=popularity.desc`,
  TopRatedMovies: `${BASE_URL}/movie/top_rated?${API_KEY}&${LANG}`,
  ActionMovies: `${BASE_URL}/discover/movie?${API_KEY}&${LANG}&with_genres=28`,
  ComedyMovies: `${BASE_URL}/discover/movie?${API_KEY}&${LANG}&with_genres=35`,
  HorrorMovies: `${BASE_URL}/discover/movie?${API_KEY}&${LANG}&with_genres=27`,
  RomanceMovies: `${BASE_URL}/discover/movie?${API_KEY}&${LANG}&with_genres=10749`,
  DocumentaryMovies: `${BASE_URL}/discover/movie?${API_KEY}&${LANG}&with_genres=99`,
  SearchMovies: `${BASE_URL}/search/movie?${API_KEY}&${LANG}`,
  SearchSeries: `${BASE_URL}/search/tv?${API_KEY}&${LANG}`,
  SearchAll: `${BASE_URL}/search/multi?${API_KEY}&${LANG}`,
  RetreiveBookmarkedMovies: `http://localhost:8081/retreive_bookmarked_movies`,
  RetreiveBookmarkedSeries: `http://localhost:8081/retreive_bookmarked_series`,
};

export default PATHS;
