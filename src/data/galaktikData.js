const nominalResources = [
  {
    id: "helium",
    label: "Helium reserves",
    current: 74,
    capacity: 100,
    tone: "cyan",
    detail: "+8% from last cycle",
  },
  {
    id: "quantum",
    label: "Quantum cores",
    current: 31,
    capacity: 40,
    tone: "violet",
    detail: "3 cores allocated today",
  },
  {
    id: "med",
    label: "Medical kits",
    current: 48,
    capacity: 60,
    tone: "gold",
    detail: "Stable across sectors",
  },
];

const alertResources = [
  {
    id: "helium",
    label: "Helium reserves",
    current: 39,
    capacity: 100,
    tone: "magenta",
    detail: "-22% after emergency reroute",
  },
  {
    id: "quantum",
    label: "Quantum cores",
    current: 12,
    capacity: 40,
    tone: "magenta",
    detail: "8 cores consumed by shield failures",
  },
  {
    id: "med",
    label: "Medical kits",
    current: 17,
    capacity: 60,
    tone: "gold",
    detail: "Field triage requests rising",
  },
];

const crewProfiles = {
  "nyra-vale": {
    callsign: "Aster Nine",
    homeSector: "Orion Fringe",
    clearance: "Command Tier 4",
    commsChannel: "OR-7A",
    bio: "Veteran mission commander trusted with relay stabilization and cross-sector fleet coordination.",
    certifications: ["Long-range navigation", "Crisis command", "Fleet routing"],
  },
  "cass-orin": {
    callsign: "Vector Slate",
    homeSector: "Outer Relay 7A",
    clearance: "Systems Tier 3",
    commsChannel: "NET-42",
    bio: "Signal-routing specialist focused on degraded-network recovery, packet stability, and backup relay logic.",
    certifications: ["Beacon calibration", "Signal routing", "Systems diagnostics"],
  },
  "tala-rho": {
    callsign: "Ledger Drift",
    homeSector: "Mercury Drift",
    clearance: "Commerce Tier 3",
    commsChannel: "EX-18",
    bio: "Resource architect balancing mission inventory, corridor readiness, and trade deployment budgets.",
    certifications: ["Supply planning", "Cargo security", "Resource modeling"],
  },
  "juno-kest": {
    callsign: "Bastion Six",
    homeSector: "Atlas Rim",
    clearance: "Defense Tier 4",
    commsChannel: "AT-SEC",
    bio: "Security lead assigned to perimeter hardening, threat interception, and shield corridor response.",
    certifications: ["Threat response", "Perimeter defense", "Shield enforcement"],
  },
  "sol-miren": {
    callsign: "Verdant Echo",
    homeSector: "Verdant Ring",
    clearance: "Survey Tier 2",
    commsChannel: "VR-BIO",
    bio: "Field biologist handling xeno-signal surveys, habitat viability analysis, and live sample recovery.",
    certifications: ["Xeno analysis", "Hazard fieldwork", "Atmospheric sampling"],
  },
  "lyx-soren": {
    callsign: "Mercury Line",
    homeSector: "Mercury Drift",
    clearance: "Trade Tier 3",
    commsChannel: "DR-22",
    bio: "Commerce liaison coordinating partner exchange windows, corridor access, and pricing uplinks.",
    certifications: ["Trade corridors", "Partner ops", "Exchange routing"],
  },
};

const nominalCrew = [
  {
    id: "nyra-vale",
    name: "Nyra Vale",
    role: "Mission Commander",
    level: 9,
    status: "Deployed",
    specialty: "Long-range ops",
    missionId: "orion-relay",
    efficiency: "97%",
  },
  {
    id: "cass-orin",
    name: "Cass Orin",
    role: "Systems Navigator",
    level: 7,
    status: "Calibrating",
    specialty: "Signal routing",
    missionId: "orion-relay",
    efficiency: "91%",
  },
  {
    id: "tala-rho",
    name: "Tala Rho",
    role: "Resource Architect",
    level: 8,
    status: "On deck",
    specialty: "Supply optimization",
    missionId: "ember-vault",
    efficiency: "95%",
  },
  {
    id: "juno-kest",
    name: "Juno Kest",
    role: "Security Lead",
    level: 6,
    status: "Deployed",
    specialty: "Threat response",
    missionId: "atlas-gate",
    efficiency: "88%",
  },
  {
    id: "sol-miren",
    name: "Sol Miren",
    role: "Field Biologist",
    level: 5,
    status: "Recovering",
    specialty: "Xeno analysis",
    missionId: "verdant-ring",
    efficiency: "84%",
  },
  {
    id: "lyx-soren",
    name: "Lyx Soren",
    role: "Commerce Liaison",
    level: 7,
    status: "Monitoring",
    specialty: "Trade corridors",
    missionId: "ember-vault",
    efficiency: "93%",
  },
];

const alertCrew = [
  {
    id: "nyra-vale",
    name: "Nyra Vale",
    role: "Mission Commander",
    level: 9,
    status: "Critical",
    specialty: "Long-range ops",
    missionId: "orion-relay",
    efficiency: "63%",
  },
  {
    id: "cass-orin",
    name: "Cass Orin",
    role: "Systems Navigator",
    level: 7,
    status: "Offline",
    specialty: "Signal routing",
    missionId: "orion-relay",
    efficiency: "41%",
  },
  {
    id: "tala-rho",
    name: "Tala Rho",
    role: "Resource Architect",
    level: 8,
    status: "Evacuating",
    specialty: "Supply optimization",
    missionId: "ember-vault",
    efficiency: "58%",
  },
  {
    id: "juno-kest",
    name: "Juno Kest",
    role: "Security Lead",
    level: 6,
    status: "Deployed",
    specialty: "Threat response",
    missionId: "atlas-gate",
    efficiency: "72%",
  },
  {
    id: "sol-miren",
    name: "Sol Miren",
    role: "Field Biologist",
    level: 5,
    status: "Critical",
    specialty: "Xeno analysis",
    missionId: "verdant-ring",
    efficiency: "39%",
  },
  {
    id: "lyx-soren",
    name: "Lyx Soren",
    role: "Commerce Liaison",
    level: 7,
    status: "Rerouted",
    specialty: "Trade corridors",
    missionId: "ember-vault",
    efficiency: "51%",
  },
];

const nominalMissions = [
  {
    id: "orion-relay",
    name: "Orion Relay Sweep",
    status: "Active",
    priority: "Critical",
    category: "Signal Recovery",
    region: "Orion Fringe",
    summary:
      "Reestablish relay stability across the fringe before blackout zones impact convoy routing.",
    reward: "42k credits",
    startedAt: "04:10 UTC",
    difficulty: "S-4",
    assignedCrew: ["nyra-vale", "cass-orin"],
    objectives: [
      "Realign relay array 7A",
      "Purge corrupted beacon packets",
      "Reopen civilian routing lanes",
    ],
    resourceCost: {
      fuel: "18 units",
      cores: "2 quantum cores",
      med: "4 kits",
    },
    timeline: [
      { label: "Jump corridor locked", state: "Complete", time: "04:18 UTC" },
      { label: "Beacon drift detected", state: "Warning", time: "04:42 UTC" },
      { label: "Stabilizer patch deploying", state: "In progress", time: "05:03 UTC" },
    ],
  },
  {
    id: "ember-vault",
    name: "Ember Vault Exchange",
    status: "Planning",
    priority: "High",
    category: "Trade Protocol",
    region: "Mercury Drift",
    summary:
      "Prepare a secure commerce corridor for rare material exchange with partner guilds in the drift.",
    reward: "28k credits",
    startedAt: "07:25 UTC",
    difficulty: "S-2",
    assignedCrew: ["tala-rho", "lyx-soren"],
    objectives: [
      "Verify cargo seals",
      "Model lane congestion risk",
      "Approve pricing uplink",
    ],
    resourceCost: {
      fuel: "8 units",
      cores: "1 quantum core",
      med: "1 kit",
    },
    timeline: [
      { label: "Cargo request received", state: "Complete", time: "07:25 UTC" },
      { label: "Partner verification queued", state: "In progress", time: "07:41 UTC" },
      { label: "Exchange window opens", state: "Pending", time: "09:10 UTC" },
    ],
  },
  {
    id: "atlas-gate",
    name: "Atlas Gate Hardening",
    status: "Alert",
    priority: "Critical",
    category: "Defense",
    region: "Atlas Rim",
    summary:
      "Contain unauthorized scans near the gate while reinforcing shield logic for outbound fleets.",
    reward: "57k credits",
    startedAt: "02:58 UTC",
    difficulty: "S-5",
    assignedCrew: ["juno-kest"],
    objectives: [
      "Quarantine hostile scan signatures",
      "Patch shield relay firmware",
      "Resume outbound fleet windows",
    ],
    resourceCost: {
      fuel: "21 units",
      cores: "3 quantum cores",
      med: "6 kits",
    },
    timeline: [
      { label: "Unauthorized scans detected", state: "Complete", time: "03:02 UTC" },
      { label: "Gate perimeter sealed", state: "Complete", time: "03:26 UTC" },
      { label: "Defense patch under review", state: "Warning", time: "04:48 UTC" },
    ],
  },
  {
    id: "verdant-ring",
    name: "Verdant Ring Survey",
    status: "Standby",
    priority: "Medium",
    category: "Exploration",
    region: "Verdant Ring",
    summary:
      "Resume bio-signal survey once atmospheric noise drops below the safe threshold.",
    reward: "16k credits",
    startedAt: "11:40 UTC",
    difficulty: "S-1",
    assignedCrew: ["sol-miren"],
    objectives: [
      "Deploy pollen drones",
      "Collect ring-surface samples",
      "Transmit habitat viability report",
    ],
    resourceCost: {
      fuel: "5 units",
      cores: "0 quantum cores",
      med: "2 kits",
    },
    timeline: [
      { label: "Survey craft docked", state: "Complete", time: "11:46 UTC" },
      { label: "Atmospheric noise spike", state: "Warning", time: "12:09 UTC" },
      { label: "Awaiting clearance", state: "Pending", time: "12:12 UTC" },
    ],
  },
];

const alertMissions = [
  {
    id: "orion-relay",
    name: "Orion Relay Collapse",
    status: "Alert",
    priority: "Critical",
    category: "Signal Recovery",
    region: "Orion Fringe",
    summary:
      "Relay integrity has dropped below safe thresholds and civilian routing is now unstable across the fringe.",
    reward: "42k credits",
    startedAt: "04:10 UTC",
    difficulty: "S-5",
    assignedCrew: ["nyra-vale", "cass-orin"],
    objectives: [
      "Stabilize relay array 7A",
      "Contain cascading beacon failures",
      "Restore one safe outbound lane",
    ],
    resourceCost: {
      fuel: "31 units",
      cores: "5 quantum cores",
      med: "9 kits",
    },
    timeline: [
      { label: "Civilian routing failure confirmed", state: "Critical", time: "04:18 UTC" },
      { label: "Navigator uplink lost", state: "Offline", time: "04:42 UTC" },
      { label: "Emergency patch routed through backup net", state: "In progress", time: "05:03 UTC" },
    ],
  },
  {
    id: "ember-vault",
    name: "Ember Vault Breach",
    status: "Alert",
    priority: "Critical",
    category: "Trade Protocol",
    region: "Mercury Drift",
    summary:
      "The exchange corridor is compromised and partner cargo lanes are under forced lockdown.",
    reward: "28k credits",
    startedAt: "07:25 UTC",
    difficulty: "S-4",
    assignedCrew: ["tala-rho", "lyx-soren"],
    objectives: [
      "Lock compromised cargo manifests",
      "Evacuate partner exchange crew",
      "Reroute all live trade lanes",
    ],
    resourceCost: {
      fuel: "19 units",
      cores: "3 quantum cores",
      med: "5 kits",
    },
    timeline: [
      { label: "Unauthorized vault access logged", state: "Critical", time: "07:25 UTC" },
      { label: "Commerce team rerouted", state: "Rerouted", time: "07:41 UTC" },
      { label: "Exchange corridor remains sealed", state: "Warning", time: "09:10 UTC" },
    ],
  },
  {
    id: "atlas-gate",
    name: "Atlas Gate Failure",
    status: "Alert",
    priority: "Critical",
    category: "Defense",
    region: "Atlas Rim",
    summary:
      "Shield logic is degrading under live pressure and outbound fleets remain suspended at the gate.",
    reward: "57k credits",
    startedAt: "02:58 UTC",
    difficulty: "S-5",
    assignedCrew: ["juno-kest"],
    objectives: [
      "Hold perimeter under active threat",
      "Deploy emergency shield patch",
      "Prevent gate-wide cascade failure",
    ],
    resourceCost: {
      fuel: "35 units",
      cores: "7 quantum cores",
      med: "11 kits",
    },
    timeline: [
      { label: "Perimeter breach escalated", state: "Critical", time: "03:02 UTC" },
      { label: "Outbound fleets hard-stopped", state: "Warning", time: "03:26 UTC" },
      { label: "Defense firmware rollback failed", state: "Critical", time: "04:48 UTC" },
    ],
  },
  {
    id: "verdant-ring",
    name: "Verdant Ring Extraction",
    status: "Alert",
    priority: "High",
    category: "Exploration",
    region: "Verdant Ring",
    summary:
      "The survey team is now in extraction mode after toxic atmospheric activity breached safe margins.",
    reward: "16k credits",
    startedAt: "11:40 UTC",
    difficulty: "S-3",
    assignedCrew: ["sol-miren"],
    objectives: [
      "Recover downed survey drones",
      "Extract the field biologist",
      "Seal the contaminated landing corridor",
    ],
    resourceCost: {
      fuel: "14 units",
      cores: "1 quantum core",
      med: "8 kits",
    },
    timeline: [
      { label: "Toxic bloom expanded beyond safe range", state: "Critical", time: "11:46 UTC" },
      { label: "Field bio team requested extraction", state: "Warning", time: "12:09 UTC" },
      { label: "Containment corridor en route", state: "In progress", time: "12:12 UTC" },
    ],
  },
];

const nominalAlerts = [
  {
    id: "alert-1",
    type: "Security",
    severity: "High",
    title: "Atlas Gate scan wall breached for 12 seconds",
    timestamp: "2 min ago",
  },
  {
    id: "alert-2",
    type: "Mission",
    severity: "Medium",
    title: "Orion relay stabilizer patch reached 84% completion",
    timestamp: "9 min ago",
  },
  {
    id: "alert-3",
    type: "Trade",
    severity: "Low",
    title: "Ember Vault exchange corridor entered green band",
    timestamp: "18 min ago",
  },
  {
    id: "alert-4",
    type: "Medical",
    severity: "Low",
    title: "Recovery status updated for Sol Miren",
    timestamp: "36 min ago",
  },
];

const alertAlerts = [
  {
    id: "alert-1",
    type: "Security",
    severity: "Critical",
    title: "Atlas Gate shield ring collapsed across two perimeter sectors",
    timestamp: "just now",
  },
  {
    id: "alert-2",
    type: "Mission",
    severity: "Critical",
    title: "Orion relay cascade has cut civilian routing capacity to 41%",
    timestamp: "1 min ago",
  },
  {
    id: "alert-3",
    type: "Trade",
    severity: "High",
    title: "Mercury Drift corridor locked after unauthorized vault breach",
    timestamp: "4 min ago",
  },
  {
    id: "alert-4",
    type: "Medical",
    severity: "High",
    title: "Verdant Ring extraction request escalated to emergency channel",
    timestamp: "7 min ago",
  },
];

const nominalTransmissions = [
  {
    id: "tx-1",
    source: "Outer Relay 7A",
    title: "Packet corruption contained. Routing stability climbing.",
    status: "Recovered",
  },
  {
    id: "tx-2",
    source: "Mercury Drift Guild",
    title: "Cargo window confirmed for second moon channel.",
    status: "Pending review",
  },
  {
    id: "tx-3",
    source: "Atlas Perimeter Net",
    title: "Defense firmware requires one additional signature.",
    status: "Escalated",
  },
];

const alertTransmissions = [
  {
    id: "tx-1",
    source: "Outer Relay 7A",
    title: "Fallback packet net failing. Civilian lane collapse imminent.",
    status: "Critical",
  },
  {
    id: "tx-2",
    source: "Mercury Drift Guild",
    title: "Cargo partners abandoning corridor after vault compromise.",
    status: "Rerouted",
  },
  {
    id: "tx-3",
    source: "Atlas Perimeter Net",
    title: "Primary shield firmware rollback rejected by live defense ring.",
    status: "Escalated",
  },
];

const nominalMetrics = [
  { label: "Active missions", value: "04", trend: "+1 since previous cycle", tone: "cyan" },
  { label: "Explorers assigned", value: "06", trend: "2 teams deployed off-station", tone: "violet" },
  { label: "High-severity alerts", value: "03", trend: "Security focus at Atlas Rim", tone: "magenta" },
  { label: "Trade corridor uptime", value: "99.2%", trend: "Stable commerce routing", tone: "gold" },
];

const alertMetrics = [
  { label: "Critical missions", value: "04", trend: "All sectors above safe threshold", tone: "magenta" },
  { label: "Crew stability", value: "41%", trend: "Multiple teams degraded or offline", tone: "magenta" },
  { label: "High-severity alerts", value: "11", trend: "Escalation across every channel", tone: "magenta" },
  { label: "Trade corridor uptime", value: "27.4%", trend: "Civilian commerce severely impaired", tone: "gold" },
];

const scenarioData = {
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
