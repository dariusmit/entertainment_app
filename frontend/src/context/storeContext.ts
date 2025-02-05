import { createContext } from "react";
import storeContextType from "../types/storeContextType";

//{} as storeContextType is a TypeScript type assertion, which tells the compiler to treat {} as if it were of type storeContextType
export const Context = createContext<storeContextType>({} as storeContextType);
