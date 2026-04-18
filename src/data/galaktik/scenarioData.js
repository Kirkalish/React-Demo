import { alertAlerts, alertTransmissions, nominalAlerts, nominalTransmissions } from "./activity";
import { alertCrew, nominalCrew } from "./crew";
import { alertMetrics, nominalMetrics } from "./metrics";
import { alertMissions, nominalMissions } from "./missions";
import { alertResources, nominalResources } from "./resources";

export const scenarioData = {
  nominal: {
    resources: nominalResources,
    crew: nominalCrew,
    missions: nominalMissions,
    alerts: nominalAlerts,
    transmissions: nominalTransmissions,
    metrics: nominalMetrics,
    networkLabel: "Systems nominal",
    cycleLabel: "Cycle 214.77",
    readiness: "92%",
  },
  alert: {
    resources: alertResources,
    crew: alertCrew,
    missions: alertMissions,
    alerts: alertAlerts,
    transmissions: alertTransmissions,
    metrics: alertMetrics,
    networkLabel: "Red alert engaged",
    cycleLabel: "Cycle 214.77A",
    readiness: "41%",
  },
};
