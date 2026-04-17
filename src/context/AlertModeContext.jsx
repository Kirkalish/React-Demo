import React, { createContext, useContext, useState } from "react";
import { getScenarioData } from "../data/galaktikData";

const AlertModeContext = createContext(null);

export function AlertModeProvider({ children }) {
  const [redAlert, setRedAlert] = useState(false);
  const data = getScenarioData(redAlert);

  return (
    <AlertModeContext.Provider
      value={{
        redAlert,
        setRedAlert,
        data,
      }}
    >
      {children}
    </AlertModeContext.Provider>
  );
}

export function useAlertMode() {
  const context = useContext(AlertModeContext);

  if (!context) {
    throw new Error("useAlertMode must be used within an AlertModeProvider");
  }

  return context;
}
