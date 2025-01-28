import pathsType from "./pathsType";
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
  isLoggedIn: boolean;
  setLoggedInStatus: React.Dispatch<React.SetStateAction<boolean>>;
  inputError: string;
  setInputError: React.Dispatch<React.SetStateAction<string>>;
  userModal: boolean;
  setUserModal: React.Dispatch<React.SetStateAction<boolean>>;
  userID: number;
  setUserID: React.Dispatch<React.SetStateAction<number>>;
  debouncedSearchValue: string;
  getContent: (path: string) => Promise<any>;
  PATHS: pathsType;
}

export default storeContextType;
