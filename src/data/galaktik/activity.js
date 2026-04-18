export const nominalAlerts = [
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

export const alertAlerts = [
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

export const nominalTransmissions = [
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

export const alertTransmissions = [
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
