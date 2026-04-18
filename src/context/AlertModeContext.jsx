import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getScenarioData } from "../data/galaktikData";
import { clearStoredAppState, readAppState, updateStoredAppState } from "../lib/localState";

const AlertModeContext = createContext(null);
const RECENT_COMMAND_LIMIT = 6;
const NOTIFICATION_LIMIT = 40;
const statusOrder = ["Planning", "Standby", "Active", "Alert", "Complete"];

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

function cloneMissionList(list) {
  return list.map((mission) => ({
    ...mission,
    assignedCrew: [...mission.assignedCrew],
    objectives: [...mission.objectives],
    resourceCost: { ...mission.resourceCost },
    timeline: mission.timeline.map((entry) => ({ ...entry })),
  }));
}

function cloneSimpleList(list) {
  return list.map((item) => ({ ...item }));
}

function cloneMetricList(list) {
  return list.map((metric) => ({ ...metric }));
}

function createScenarioState(scenario) {
  return {
    crew: cloneCrewList(scenario.crew),
    missions: cloneMissionList(scenario.missions),
    alerts: cloneSimpleList(scenario.alerts),
    transmissions: cloneSimpleList(scenario.transmissions),
    metrics: cloneMetricList(scenario.metrics),
  };
}

function createInitialOperationsState(nominalScenario, alertScenario) {
  return {
    nominal: createScenarioState(nominalScenario),
    alert: createScenarioState(alertScenario),
  };
}

function resolveStoredModeList(storedMode, key, fallbackMode, cloneFn) {
  if (!storedMode || !Array.isArray(storedMode[key])) {
    return cloneFn(fallbackMode[key]);
  }

  return cloneFn(storedMode[key]);
}

function resolveStoredOperationsState(storedValue, fallback) {
  if (!storedValue?.nominal || !storedValue?.alert) {
    return createInitialOperationsStateFromFallback(fallback);
  }

  return {
    nominal: {
      crew: resolveStoredModeList(storedValue.nominal, "crew", fallback.nominal, cloneCrewList),
      missions: resolveStoredModeList(storedValue.nominal, "missions", fallback.nominal, cloneMissionList),
      alerts: resolveStoredModeList(storedValue.nominal, "alerts", fallback.nominal, cloneSimpleList),
      transmissions: resolveStoredModeList(storedValue.nominal, "transmissions", fallback.nominal, cloneSimpleList),
      metrics: resolveStoredModeList(storedValue.nominal, "metrics", fallback.nominal, cloneMetricList),
    },
    alert: {
      crew: resolveStoredModeList(storedValue.alert, "crew", fallback.alert, cloneCrewList),
      missions: resolveStoredModeList(storedValue.alert, "missions", fallback.alert, cloneMissionList),
      alerts: resolveStoredModeList(storedValue.alert, "alerts", fallback.alert, cloneSimpleList),
      transmissions: resolveStoredModeList(storedValue.alert, "transmissions", fallback.alert, cloneSimpleList),
      metrics: resolveStoredModeList(storedValue.alert, "metrics", fallback.alert, cloneMetricList),
    },
  };
}

function createInitialOperationsStateFromFallback(fallback) {
  return {
    nominal: {
      crew: cloneCrewList(fallback.nominal.crew),
      missions: cloneMissionList(fallback.nominal.missions),
      alerts: cloneSimpleList(fallback.nominal.alerts),
      transmissions: cloneSimpleList(fallback.nominal.transmissions),
      metrics: cloneMetricList(fallback.nominal.metrics),
    },
    alert: {
      crew: cloneCrewList(fallback.alert.crew),
      missions: cloneMissionList(fallback.alert.missions),
      alerts: cloneSimpleList(fallback.alert.alerts),
      transmissions: cloneSimpleList(fallback.alert.transmissions),
      metrics: cloneMetricList(fallback.alert.metrics),
    },
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

function resolveStoredRecentCommands(storedValue) {
  return Array.isArray(storedValue) ? storedValue.slice(0, RECENT_COMMAND_LIMIT) : [];
}

function resolveStoredNotificationFeed(storedValue) {
  return Array.isArray(storedValue) ? storedValue.slice(0, NOTIFICATION_LIMIT) : [];
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function parseEfficiency(value) {
  const numeric = Number.parseInt(String(value).replace("%", ""), 10);
  return Number.isNaN(numeric) ? 0 : numeric;
}

function toPercentString(value) {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
}

function deriveMetrics({ redAlert, crew, alerts, missions, baseMetrics }) {
  const visibleCrew = crew.filter((member) => !member.hidden);
  const alertCount = alerts.filter((item) => ["High", "Critical"].includes(item.severity)).length;
  const avgEfficiency =
    visibleCrew.length > 0
      ? visibleCrew.reduce((total, member) => total + parseEfficiency(member.efficiency), 0) /
        visibleCrew.length
      : 0;
  const degradedCount = visibleCrew.filter((member) =>
    ["Critical", "Offline", "Evacuating", "Rerouted"].includes(member.status),
  ).length;
  const engagedCount = visibleCrew.filter((member) =>
    ["Deployed", "Calibrating", "Monitoring", "Critical"].includes(member.status),
  ).length;
  const trackedMissionCount = redAlert
    ? missions.filter((mission) => mission.status === "Alert" || mission.priority === "Critical").length
    : missions.length;
  const impairedTradeMissionCount = missions.filter((mission) => mission.category === "Trade Protocol").length;

  return baseMetrics.map((metric, index) => {
    if (index === 0) {
      return {
        ...metric,
        value: String(trackedMissionCount).padStart(2, "0"),
      };
    }

    if (index === 1) {
      return {
        ...metric,
        value: redAlert ? toPercentString(avgEfficiency) : String(visibleCrew.length).padStart(2, "0"),
        trend: redAlert
          ? `${Math.max(1, degradedCount)} teams degraded or offline`
          : `${Math.max(1, Math.ceil(engagedCount / 2))} teams deployed off-station`,
      };
    }

    if (index === 2) {
      return {
        ...metric,
        value: String(alertCount).padStart(2, "0"),
      };
    }

    return {
      ...metric,
      value: redAlert
        ? `${Math.max(12, 100 - alertCount * 8 - degradedCount * 5 - impairedTradeMissionCount * 6).toFixed(1)}%`
        : `${Math.max(92, 100 - alertCount * 0.2).toFixed(1)}%`,
    };
  });
}

function appendTimelineEntry(mission, label, state, time) {
  return {
    ...mission,
    timeline: [...mission.timeline, { label, state, time }],
  };
}

function createAlertEvent({ title, severity, type = "Operations", missionId }) {
  return {
    id: createId("alert"),
    type,
    severity,
    title,
    timestamp: "just now",
    missionId,
  };
}

function createTransmissionEvent({ title, source, status, missionId }) {
  return {
    id: createId("tx"),
    source,
    title,
    status,
    missionId,
  };
}

export function AlertModeProvider({ children }) {
  const nominalScenario = useMemo(() => getScenarioData(false), []);
  const alertScenario = useMemo(() => getScenarioData(true), []);
  const fallbackOperations = useMemo(
    () => createInitialOperationsState(nominalScenario, alertScenario),
    [alertScenario, nominalScenario],
  );
  const storedState = useMemo(() => readAppState(), []);
  const [redAlert, setRedAlert] = useState(() => storedState.redAlert ?? false);
  const [operationsByMode, setOperationsByMode] = useState(() =>
    resolveStoredOperationsState(storedState.operationsByMode, fallbackOperations),
  );
  const [preferences, setPreferences] = useState(() =>
    resolveStoredPreferences(storedState.preferences),
  );
  const [recentCommands, setRecentCommands] = useState(() =>
    resolveStoredRecentCommands(storedState.recentCommands),
  );
  const [notificationFeed, setNotificationFeed] = useState(() =>
    resolveStoredNotificationFeed(storedState.notificationFeed),
  );
  const [toasts, setToasts] = useState([]);

  const activeMode = redAlert ? "alert" : "nominal";
  const baseScenario = redAlert ? alertScenario : nominalScenario;
  const activeOperations = operationsByMode[activeMode];
  const crewDataset = activeOperations.crew;

  const addToast = useCallback((toast) => {
    const id = createId("toast");
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const nextToast = { id, tone: "default", ...toast, timestamp };
    setToasts((current) => [...current, nextToast]);
    setNotificationFeed((current) => [nextToast, ...current].slice(0, NOTIFICATION_LIMIT));
    return id;
  }, []);

  const dismissToast = useCallback((toastId) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const clearNotificationFeed = useCallback(() => {
    setNotificationFeed([]);
  }, []);

  const registerCommand = useCallback((command) => {
    setRecentCommands((current) => {
      const next = [
        {
          id: command.id,
          label: command.label,
          description: command.description,
          group: command.group,
        },
        ...current.filter((item) => item.id !== command.id),
      ].slice(0, RECENT_COMMAND_LIMIT);

      return next;
    });
  }, []);

  const pushActivityItems = useCallback((mode, payload) => {
    setOperationsByMode((current) => ({
      ...current,
      [mode]: {
        ...current[mode],
        alerts: payload.alert ? [payload.alert, ...current[mode].alerts].slice(0, 8) : current[mode].alerts,
        transmissions: payload.transmission
          ? [payload.transmission, ...current[mode].transmissions].slice(0, 8)
          : current[mode].transmissions,
      },
    }));
  }, []);

  useEffect(() => {
    updateStoredAppState({ redAlert });
  }, [redAlert]);

  useEffect(() => {
    updateStoredAppState({ operationsByMode });
  }, [operationsByMode]);

  useEffect(() => {
    updateStoredAppState({ preferences });
  }, [preferences]);

  useEffect(() => {
    updateStoredAppState({ recentCommands });
  }, [recentCommands]);

  useEffect(() => {
    updateStoredAppState({ notificationFeed });
  }, [notificationFeed]);

  const data = useMemo(() => {
    const visibleCrew = activeOperations.crew.filter((member) => !member.hidden);
    return {
      ...baseScenario,
      crew: visibleCrew,
      missions: activeOperations.missions,
      alerts: activeOperations.alerts,
      transmissions: activeOperations.transmissions,
      metrics: deriveMetrics({
        redAlert,
        crew: activeOperations.crew,
        alerts: activeOperations.alerts,
        missions: activeOperations.missions,
        baseMetrics: activeOperations.metrics,
      }),
    };
  }, [
    activeOperations.alerts,
    activeOperations.crew,
    activeOperations.metrics,
    activeOperations.missions,
    activeOperations.transmissions,
    baseScenario,
    redAlert,
  ]);

  const upsertCrewMember = useCallback(
    (member) => {
      setOperationsByMode((current) => {
        const nextModeCrew = current[activeMode].crew.some((entry) => entry.id === member.id)
          ? current[activeMode].crew.map((entry) => (entry.id === member.id ? { ...entry, ...member } : entry))
          : [...current[activeMode].crew, { ...member, hidden: false }];

        return {
          ...current,
          [activeMode]: {
            ...current[activeMode],
            crew: nextModeCrew,
          },
        };
      });

      const title = crewDataset.some((entry) => entry.id === member.id)
        ? `Crew record updated for ${member.name}`
        : `Crew record created for ${member.name}`;

      pushActivityItems(activeMode, {
        alert: createAlertEvent({
          title,
          severity: redAlert ? "High" : "Medium",
          type: "Crew",
        }),
        transmission: createTransmissionEvent({
          title: `${member.name} dossier synchronized with active roster changes.`,
          source: "Crew operations",
          status: "Updated",
        }),
      });

      addToast({
        title,
        description: "The explorer dataset and live activity feed have been updated.",
      });
    },
    [activeMode, addToast, crewDataset, pushActivityItems, redAlert],
  );

  const setCrewMemberHidden = useCallback(
    (memberId, hidden) => {
      const member = crewDataset.find((entry) => entry.id === memberId);

      setOperationsByMode((current) => ({
        ...current,
        [activeMode]: {
          ...current[activeMode],
          crew: current[activeMode].crew.map((item) =>
            item.id === memberId ? { ...item, hidden } : item,
          ),
        },
      }));

      if (member) {
        const title = hidden ? `${member.name} hidden from roster` : `${member.name} restored to roster`;

        pushActivityItems(activeMode, {
          alert: createAlertEvent({
            title,
            severity: "Low",
            type: "Crew",
          }),
        });

        addToast({
          title,
          description: hidden
            ? "The explorer remains in the dataset and can be restored later."
            : "The explorer is visible again in the roster view.",
        });
      }
    },
    [activeMode, addToast, crewDataset, pushActivityItems],
  );

  const resetCrewDataset = useCallback(() => {
    setOperationsByMode((current) => ({
      ...current,
      [activeMode]: {
        ...current[activeMode],
        crew: cloneCrewList((redAlert ? alertScenario : nominalScenario).crew),
      },
    }));

    pushActivityItems(activeMode, {
      alert: createAlertEvent({
        title: "Crew dataset restored to scenario baseline",
        severity: redAlert ? "Medium" : "Low",
        type: "Crew",
      }),
      transmission: createTransmissionEvent({
        title: "Roster records reverted to their current scenario defaults.",
        source: "Crew operations",
        status: "Reset",
      }),
    });

    addToast({
      title: "Crew dataset reset",
      description: "Explorer records were restored to the scenario defaults.",
    });
  }, [activeMode, addToast, alertScenario, nominalScenario, pushActivityItems, redAlert]);

  const updateAccessibilityPreference = useCallback((key, value) => {
    setPreferences((current) => ({
      ...current,
      accessibility: {
        ...current.accessibility,
        [key]: value,
      },
    }));

    addToast({
      title: "Accessibility preference updated",
      description: `${key === "reduceMotion" ? "Reduce motion" : "Enhanced contrast"} has been ${value ? "enabled" : "disabled"}.`,
    });
  }, [addToast]);

  const updateThemePreference = useCallback((mode, value) => {
    setPreferences((current) => ({
      ...current,
      themes: {
        ...current.themes,
        [mode]: value,
      },
    }));

    addToast({
      title: "Theme updated",
      description: `${mode === "nominal" ? "Nominal" : "Alert"} palette switched to ${value}.`,
    });
  }, [addToast]);

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
    addToast({
      title: "Preferences reset",
      description: "Accessibility and theme settings were restored to their defaults.",
    });
  }, [addToast]);

  const resetAppState = useCallback(() => {
    clearStoredAppState();
    setRedAlert(false);
    setOperationsByMode(createInitialOperationsState(nominalScenario, alertScenario));
    setPreferences(defaultPreferences);
    setRecentCommands([]);
    setNotificationFeed([]);
    setToasts([]);
  }, [alertScenario, nominalScenario]);

  const updateMissionStatus = useCallback(
    (missionId, nextStatus, reason = "") => {
      const mission = activeOperations.missions.find((entry) => entry.id === missionId);

      if (!mission || mission.status === nextStatus) {
        return;
      }

      const now = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      setOperationsByMode((current) => ({
        ...current,
        [activeMode]: {
          ...current[activeMode],
          missions: current[activeMode].missions.map((entry) =>
            entry.id === missionId
              ? appendTimelineEntry(
                  { ...entry, status: nextStatus },
                  reason || `Status advanced to ${nextStatus}`,
                  nextStatus,
                  `${now} UTC`,
                )
              : entry,
          ),
        },
      }));

      const title = `${mission.name} moved to ${nextStatus}`;
      pushActivityItems(activeMode, {
        alert: createAlertEvent({
          title,
          severity: nextStatus === "Alert" ? "Critical" : nextStatus === "Complete" ? "Low" : "Medium",
          type: "Mission",
          missionId,
        }),
        transmission: createTransmissionEvent({
          title: reason || `${mission.name} status updated to ${nextStatus}.`,
          source: "Mission registry",
          status: nextStatus,
          missionId,
        }),
      });

      addToast({
        title,
        description: reason || "The mission timeline and activity feeds were updated.",
      });
    },
    [activeMode, activeOperations.missions, addToast, pushActivityItems],
  );

  const advanceMissionStatus = useCallback(
    (missionId) => {
      const mission = activeOperations.missions.find((entry) => entry.id === missionId);

      if (!mission) {
        return;
      }

      const currentIndex = statusOrder.indexOf(mission.status);
      const nextStatus = statusOrder[Math.min(statusOrder.length - 1, currentIndex + 1)] ?? mission.status;

      updateMissionStatus(missionId, nextStatus, `Operations command advanced ${mission.name} to ${nextStatus}.`);
    },
    [activeOperations.missions, updateMissionStatus],
  );

  const executeSimulation = useCallback(
    (commandId) => {
      const nextMode = redAlert ? "alert" : "nominal";

      if (commandId === "toggle-alert") {
        const nextAlertState = !redAlert;
        setRedAlert(nextAlertState);
        pushActivityItems(nextAlertState ? "alert" : "nominal", {
          alert: createAlertEvent({
            title: nextAlertState ? "Red alert simulation engaged" : "Nominal operations restored",
            severity: nextAlertState ? "Critical" : "Low",
            type: "Systems",
          }),
          transmission: createTransmissionEvent({
            title: nextAlertState
              ? "Deck controls shifted to critical-response state."
              : "Systems returned to standard operating thresholds.",
            source: "Simulation deck",
            status: nextAlertState ? "Escalated" : "Recovered",
          }),
        });
        addToast({
          title: nextAlertState ? "Red alert engaged" : "Nominal state restored",
          description: nextAlertState
            ? "Failure-mode simulation has been activated."
            : "The deck returned to standard operating thresholds.",
        });
        return;
      }

      if (commandId === "sector-lockdown") {
        setRedAlert(true);
        setOperationsByMode((current) => ({
          ...current,
          alert: {
            ...current.alert,
            missions: current.alert.missions.map((mission) =>
              mission.id === "atlas-gate"
                ? appendTimelineEntry(
                    { ...mission, status: "Alert", priority: "Critical" },
                    "Sector lockdown command routed through Atlas Gate defense net",
                    "Critical",
                    "just now",
                  )
                : mission,
            ),
          },
        }));
        pushActivityItems("alert", {
          alert: createAlertEvent({
            title: "Sector lockdown simulation engaged at Atlas Gate",
            severity: "Critical",
            type: "Security",
            missionId: "atlas-gate",
          }),
          transmission: createTransmissionEvent({
            title: "Outbound lane lockdown propagated to mission registry.",
            source: "Simulation deck",
            status: "Escalated",
            missionId: "atlas-gate",
          }),
        });
        addToast({
          title: "Sector lockdown initiated",
          description: "Atlas Gate defense scenarios have been escalated.",
          tone: "alert",
        });
        return;
      }

      if (commandId === "readiness-drill") {
        setOperationsByMode((current) => ({
          ...current,
          [nextMode]: {
            ...current[nextMode],
            crew: current[nextMode].crew.map((member, index) =>
              index === 0
                ? {
                    ...member,
                    status: redAlert ? "Critical" : "Monitoring",
                    efficiency: toPercentString(parseEfficiency(member.efficiency) - (redAlert ? 7 : 4)),
                  }
                : member,
            ),
          },
        }));
        pushActivityItems(nextMode, {
          alert: createAlertEvent({
            title: "Crew readiness drill published to active roster",
            severity: redAlert ? "High" : "Medium",
            type: "Crew",
          }),
          transmission: createTransmissionEvent({
            title: "Explorer readiness drill updated operator efficiency baselines.",
            source: "Simulation deck",
            status: "Published",
          }),
        });
        addToast({
          title: "Crew readiness drill executed",
          description: "Explorer readiness values have been updated for the current scenario.",
        });
        return;
      }

      if (commandId === "telemetry-sweep") {
        pushActivityItems(nextMode, {
          alert: createAlertEvent({
            title: "Telemetry sweep registered across active deck channels",
            severity: "Low",
            type: "Systems",
          }),
          transmission: createTransmissionEvent({
            title: "Diagnostics sweep queued in command palette routing.",
            source: "Simulation deck",
            status: "Queued",
          }),
        });
        addToast({
          title: "Telemetry sweep queued",
          description: "Diagnostics traffic was added to the live activity stream.",
        });
        return;
      }

      if (commandId === "comms-blackout") {
        setRedAlert(true);
        setOperationsByMode((current) => ({
          ...current,
          alert: {
            ...current.alert,
            crew: current.alert.crew.map((member) =>
              member.id === "cass-orin" ? { ...member, status: "Offline", efficiency: "32%" } : member,
            ),
            missions: current.alert.missions.map((mission) =>
              mission.id === "orion-relay"
                ? appendTimelineEntry(
                    { ...mission, status: "Alert" },
                    "Communications blackout simulation interrupted relay uplinks",
                    "Critical",
                    "just now",
                  )
                : mission,
            ),
          },
        }));
        pushActivityItems("alert", {
          alert: createAlertEvent({
            title: "Communications blackout staged across Orion relay lanes",
            severity: "Critical",
            type: "Mission",
            missionId: "orion-relay",
          }),
          transmission: createTransmissionEvent({
            title: "Fallback packet net routed through emergency channels.",
            source: "Simulation deck",
            status: "Critical",
            missionId: "orion-relay",
          }),
        });
        addToast({
          title: "Comms blackout staged",
          description: "Relay operations were pushed into blackout response mode.",
          tone: "alert",
        });
        return;
      }

      if (commandId === "restore-nominal") {
        setRedAlert(false);
        setOperationsByMode(createInitialOperationsState(nominalScenario, alertScenario));
        pushActivityItems("nominal", {
          alert: createAlertEvent({
            title: "Scenario reset to baseline nominal state",
            severity: "Low",
            type: "Systems",
          }),
          transmission: createTransmissionEvent({
            title: "Simulation deck cleared temporary drills and restored baseline telemetry.",
            source: "Simulation deck",
            status: "Recovered",
          }),
        });
        addToast({
          title: "Simulation reset complete",
          description: "Scenario data returned to the baseline nominal and alert presets.",
        });
      }
    },
    [addToast, alertScenario, nominalScenario, pushActivityItems, redAlert],
  );

  return (
    <AlertModeContext.Provider
      value={{
        redAlert,
        setRedAlert,
        data,
        crewDataset,
        preferences,
        recentCommands,
        notificationFeed,
        toasts,
        dismissToast,
        clearToasts,
        clearNotificationFeed,
        registerCommand,
        executeSimulation,
        upsertCrewMember,
        setCrewMemberHidden,
        resetCrewDataset,
        updateAccessibilityPreference,
        updateThemePreference,
        resetPreferences,
        resetAppState,
        updateMissionStatus,
        advanceMissionStatus,
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
