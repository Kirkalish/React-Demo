import { crewProfiles } from "./galaktik/crew";
import { scenarioData } from "./galaktik/scenarioData";

export function getScenarioData(redAlert = false) {
  return redAlert ? scenarioData.alert : scenarioData.nominal;
}

export function getMissionById(missions, missionId) {
  return missions.find((mission) => mission.id === missionId) ?? null;
}

export function getCrewByMission(crew, missionId) {
  return crew.filter((member) => member.missionId === missionId);
}

export function getCrewMemberById(crew, memberId) {
  return crew.find((member) => member.id === memberId) ?? null;
}

export function getMissionName(missions, missionId) {
  return getMissionById(missions, missionId)?.name ?? "Unassigned";
}

export function getCrewProfile(memberId) {
  return (
    crewProfiles[memberId] ?? {
      callsign: "Unlisted",
      homeSector: "Unknown",
      clearance: "Unassigned",
      commsChannel: "None",
      bio: "No extended crew profile is available in the current dataset.",
      certifications: [],
    }
  );
}
