import pathsType from "./pathsType";

interface storeContextType {
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
  debouncedSearchValue: string;
  PATHS: pathsType;
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
}

export default storeContextType;
