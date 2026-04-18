import React, { createContext, useContext, useMemo, useState } from "react";
import { getScenarioData } from "../data/galaktikData";

const AlertModeContext = createContext(null);

function cloneCrewList(list) {
  return list.map((member) => ({ ...member }));
}

export function AlertModeProvider({ children }) {
  const nominalScenario = useMemo(() => getScenarioData(false), []);
  const alertScenario = useMemo(() => getScenarioData(true), []);
  const [redAlert, setRedAlert] = useState(false);
  const [crewByMode, setCrewByMode] = useState(() => ({
    nominal: cloneCrewList(nominalScenario.crew),
    alert: cloneCrewList(alertScenario.crew),
  }));
  const activeMode = redAlert ? "alert" : "nominal";
  const scenario = redAlert ? alertScenario : nominalScenario;
  const crewDataset = crewByMode[activeMode];

  const data = useMemo(
    () => ({
      ...scenario,
      crew: crewDataset.filter((member) => !member.hidden),
    }),
    [crewDataset, scenario],
  );

  const upsertCrewMember = (member) => {
    setCrewByMode((current) => {
      const nextModeCrew = current[activeMode].some((entry) => entry.id === member.id)
        ? current[activeMode].map((entry) => (entry.id === member.id ? { ...entry, ...member } : entry))
        : [...current[activeMode], { ...member, hidden: false }];

      return {
        ...current,
        [activeMode]: nextModeCrew,
      };
    });
  };

  const setCrewMemberHidden = (memberId, hidden) => {
    setCrewByMode((current) => ({
      ...current,
      [activeMode]: current[activeMode].map((member) =>
        member.id === memberId ? { ...member, hidden } : member,
      ),
    }));
  };

  const resetCrewDataset = () => {
    setCrewByMode((current) => ({
      ...current,
      [activeMode]: cloneCrewList(redAlert ? alertScenario.crew : nominalScenario.crew),
    }));
  };

  return (
    <AlertModeContext.Provider
      value={{
        redAlert,
        setRedAlert,
        data,
        crewDataset,
        upsertCrewMember,
        setCrewMemberHidden,
        resetCrewDataset,
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
