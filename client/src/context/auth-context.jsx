import { createContext, useContext } from "react";

//* Create a Context
const AppContext = createContext();

//* Provider
const AppProvider = ({ children }) => {
  const API = import.meta.env.VITE_APP_URI_API;

  return <AppContext.Provider value={{ API }}>{children}</AppContext.Provider>;
};

//* Creating Consumer using Custom Hook => UseContext Hook
const useAppContext = () => {
  const appContextValue = useContext(AppContext);

  if (!appContextValue) {
    //* if we don't get the value of "authContextValue" that means we haven't wrapped the <App/> component in AuthProvider;
    throw new Error("useAppContext used outside the provider");
  }

  return appContextValue;
};

export { AppProvider, AppContext, useAppContext };
