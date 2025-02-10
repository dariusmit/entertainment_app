import { createContext } from "react";
import storeContextType from "../types/storeContextType";
import { ReactNode } from "react";
import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import inputErrorsType from "../types/inputErrorsType";
//{} as storeContextType is a TypeScript type assertion, which tells the compiler to treat {} as if it were of type storeContextType
export const Context = createContext<storeContextType>({} as storeContextType);

interface StoreContextProviderProps {
  children: ReactNode;
}

export const StoreContextProvider = ({
  children,
}: StoreContextProviderProps) => {
  const [searchValue, changeSearchValue] = useState<string>("");
  const [isLoadingAI, UpdateLoadingStatusAI] = useState<boolean | undefined>();
  const [searchError, setSearchError] = useState<string>("");
  const [userModal, setUserModal] = useState<boolean>(false);
  const [searchCompleted, setSearchCompletion] = useState<
    boolean | undefined
  >();
  const debouncedSearchValue = useDebounce(searchValue);
  const emptyErrorObject = {
    emailError: "",
    passErrors: {
      passGlobalErr: "",
      passCritErr1: "",
      passCritErr2: "",
      passCritErr3: "",
      passCritErr4: "",
      passCritErr5: "",
    },
    repeatPassError: "",
  };
  const [inputError, setInputError] =
    useState<inputErrorsType>(emptyErrorObject);

  return (
    <Context.Provider
      value={{
        searchValue,
        changeSearchValue,
        isLoadingAI,
        UpdateLoadingStatusAI,
        searchError,
        setSearchError,
        searchCompleted,
        setSearchCompletion,
        inputError,
        setInputError,
        userModal,
        setUserModal,
        debouncedSearchValue,
        emptyErrorObject,
      }}
    >
      {children}
    </Context.Provider>
  );
};
