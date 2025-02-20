import pathsType from "../types/pathsType";

export const API_KEY: string = `api_key=${import.meta.env.VITE_API_KEY}`;
export const BASE_URL: string = "https://api.themoviedb.org/3";
export const LANG: string = "language=en-US";
export const PATHS: pathsType = {
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
  SearchBookmarks: `https://entertainment-app-wheat.vercel.app/search_bookmarks`,
  RetreiveBookmarkedMovies: `https://entertainment-app-wheat.vercel.app/retreive_bookmarked_movies`,
  RetreiveBookmarkedSeries: `https://entertainment-app-wheat.vercel.app/retreive_bookmarked_series`,
};
