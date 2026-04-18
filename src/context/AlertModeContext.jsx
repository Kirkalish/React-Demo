import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getScenarioData } from "../data/galaktikData";
import { clearStoredAppState, readAppState, updateStoredAppState } from "../lib/localState";

const AlertModeContext = createContext(null);

const defaultPreferences = {
  accessibility: {
    reduceMotion: false,
    enhancedContrast: false,
  },
  themes: {
    nominal: "galactic",
    alert: "crimson",
  },
};

function cloneCrewList(list) {
  return list.map((member) => ({ ...member }));
}

function createInitialCrewByMode(nominalScenario, alertScenario) {
  return {
    nominal: cloneCrewList(nominalScenario.crew),
    alert: cloneCrewList(alertScenario.crew),
  };
}

function resolveStoredCrewByMode(storedValue, nominalScenario, alertScenario) {
  const initial = createInitialCrewByMode(nominalScenario, alertScenario);

  if (!storedValue || !Array.isArray(storedValue.nominal) || !Array.isArray(storedValue.alert)) {
    return initial;
  }

  return {
    nominal: storedValue.nominal.map((member) => ({ ...member })),
    alert: storedValue.alert.map((member) => ({ ...member })),
  };
}

function resolveStoredPreferences(storedValue) {
  return {
    accessibility: {
      ...defaultPreferences.accessibility,
      ...storedValue?.accessibility,
    },
    themes: {
      ...defaultPreferences.themes,
      ...storedValue?.themes,
    },
  };
}

export function AlertModeProvider({ children }) {
  const nominalScenario = useMemo(() => getScenarioData(false), []);
  const alertScenario = useMemo(() => getScenarioData(true), []);
  const storedState = useMemo(() => readAppState(), []);
  const [redAlert, setRedAlert] = useState(() => storedState.redAlert ?? false);
  const [crewByMode, setCrewByMode] = useState(() =>
    resolveStoredCrewByMode(storedState.crewByMode, nominalScenario, alertScenario),
  );
  const [preferences, setPreferences] = useState(() =>
    resolveStoredPreferences(storedState.preferences),
  );
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

  useEffect(() => {
    updateStoredAppState({ redAlert });
  }, [redAlert]);

  useEffect(() => {
    updateStoredAppState({ crewByMode });
  }, [crewByMode]);

  useEffect(() => {
    updateStoredAppState({ preferences });
  }, [preferences]);

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

  const updateAccessibilityPreference = (key, value) => {
    setPreferences((current) => ({
      ...current,
      accessibility: {
        ...current.accessibility,
        [key]: value,
      },
    }));
  };

  const updateThemePreference = (mode, value) => {
    setPreferences((current) => ({
      ...current,
      themes: {
        ...current.themes,
        [mode]: value,
      },
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  const resetAppState = () => {
    clearStoredAppState();
    setRedAlert(false);
    setCrewByMode(createInitialCrewByMode(nominalScenario, alertScenario));
    setPreferences(defaultPreferences);
  };

  return (
    <AlertModeContext.Provider
      value={{
        redAlert,
        setRedAlert,
        data,
        crewDataset,
        preferences,
        upsertCrewMember,
        setCrewMemberHidden,
        resetCrewDataset,
        updateAccessibilityPreference,
        updateThemePreference,
        resetPreferences,
        resetAppState,
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
