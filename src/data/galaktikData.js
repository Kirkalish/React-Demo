export const resources = [
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

export const crew = [
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

export const missions = [
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

export const alerts = [
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

export const transmissions = [
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

export function getMissionById(missionId) {
  return missions.find((mission) => mission.id === missionId) ?? null;
}

export function getCrewByMission(missionId) {
  return crew.filter((member) => member.missionId === missionId);
}

export function getMissionName(missionId) {
  return getMissionById(missionId)?.name ?? "Unassigned";
}
