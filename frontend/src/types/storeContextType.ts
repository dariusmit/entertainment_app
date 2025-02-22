import inputErrorsType from "./inputErrorsType";

interface storeContextType {
  searchValue: string;
  changeSearchValue: React.Dispatch<React.SetStateAction<string>>;
  isLoadingAI: boolean | undefined;
  UpdateLoadingStatusAI: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >;
  searchCompleted: boolean | undefined;
  setSearchCompletion: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >;
  inputError: inputErrorsType;
  setInputError: React.Dispatch<React.SetStateAction<inputErrorsType>>;
  userModal: boolean;
  setUserModal: React.Dispatch<React.SetStateAction<boolean>>;
  debouncedSearchValue: string;
  emptyErrorObject: inputErrorsType;
  isSearchVisible: boolean;
  setIsSearchVisible: React.Dispatch<React.SetStateAction<boolean>>;
  bookmarkedItems: number[];
  setBookmarkedItems: React.Dispatch<React.SetStateAction<number[]>>;
}

export default storeContextType;
