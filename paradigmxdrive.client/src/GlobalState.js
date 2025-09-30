import { createContext, useContext } from "react";

export const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);