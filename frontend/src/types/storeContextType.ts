import movieType from "./movieType";

interface storeContextType {
  movieList: movieType[];
  updateMovieList: React.Dispatch<React.SetStateAction<movieType[]>>;
  getMovieList: () => Promise<void>;
  searchValue: string;
  changeSearchValue: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  UpdateLoadingStatus: React.Dispatch<React.SetStateAction<boolean>>;
  searchError: string;
  setSearchError: React.Dispatch<React.SetStateAction<string>>;
  searchCompleted: boolean;
  setSearchCompletion: React.Dispatch<React.SetStateAction<boolean>>;
  filteredMovieList: movieType[];
  isLoggedIn: boolean;
  setLoggedInStatus: React.Dispatch<React.SetStateAction<boolean>>;
  inputError: string;
  setInputError: React.Dispatch<React.SetStateAction<string>>;
}

export default storeContextType;
