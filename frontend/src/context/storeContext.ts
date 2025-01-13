import { createContext } from "react";
import storeContextType from "../types/storeContextType";

export const Context = createContext<storeContextType>({} as storeContextType);
