import pathsType from "./pathsTYpe";
import movieType from "./movieType";
import seriesType from "./seriesType";

interface storeContextType {
  movieList: movieType[];
  updateMovieList: React.Dispatch<React.SetStateAction<movieType[]>>;
  bookmarkedMovies: movieType[];
  setBookmarkedMovies: React.Dispatch<React.SetStateAction<movieType[]>>;
  retreiveBookmarksFromDB: () => void;
  searchValue: string;
  changeSearchValue: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean | undefined;
  UpdateLoadingStatus: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >;
  searchError: string;
  setSearchError: React.Dispatch<React.SetStateAction<string>>;
  searchCompleted: boolean | undefined;
  setSearchCompletion: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >;
  filteredMovieList: movieType[];
  isLoggedIn: boolean;
  setLoggedInStatus: React.Dispatch<React.SetStateAction<boolean>>;
  inputError: string;
  setInputError: React.Dispatch<React.SetStateAction<string>>;
  userModal: boolean;
  setUserModal: React.Dispatch<React.SetStateAction<boolean>>;
  userID: number;
  setUserID: React.Dispatch<React.SetStateAction<number>>;
  debouncedSearchValue: string;
  trendingMovies: movieType[];
  updateTendingMovies: React.Dispatch<React.SetStateAction<movieType[]>>;
  trendingSeries: seriesType[];
  updateTrendingSeries: React.Dispatch<React.SetStateAction<seriesType[]>>;
  topRatedMovies: movieType[];
  updateTopRatedMovies: React.Dispatch<React.SetStateAction<movieType[]>>;
  actionMovies: movieType[];
  updateActionMovies: React.Dispatch<React.SetStateAction<movieType[]>>;
  comedyMovies: movieType[];
  updateComedyMovies: React.Dispatch<React.SetStateAction<movieType[]>>;
  horrorMovies: movieType[];
  updateHorrorMovies: React.Dispatch<React.SetStateAction<movieType[]>>;
  romanceMovies: movieType[];
  updateRomanceMovies: React.Dispatch<React.SetStateAction<movieType[]>>;
  documentaryMovies: movieType[];
  updateDocumentaryMovies: React.Dispatch<React.SetStateAction<movieType[]>>;
  getContent: (path: string) => Promise<any>;
  PATHS: pathsType;
}

export default storeContextType;
