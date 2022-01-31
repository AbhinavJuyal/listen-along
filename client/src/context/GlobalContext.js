import React, { useContext, useState } from "react";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  let [lastTS, setLastTS] = useState(0);
  const value = {
    lastTS,
    setLastTS,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

const useGlobal = () => {
  return useContext(GlobalContext);
};

export default useGlobal;
