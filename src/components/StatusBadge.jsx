import React from "react";

const toneMap = {
  Active: "status-badge--cyan",
  Planning: "status-badge--violet",
  Alert: "status-badge--magenta",
  Standby: "status-badge--gold",
  Complete: "status-badge--cyan",
  Warning: "status-badge--magenta",
  "In progress": "status-badge--violet",
  Pending: "status-badge--gold",
  Deployed: "status-badge--cyan",
  Monitoring: "status-badge--violet",
  Calibrating: "status-badge--gold",
  Recovering: "status-badge--magenta",
  "On deck": "status-badge--violet",
  High: "status-badge--magenta",
  Medium: "status-badge--gold",
  Low: "status-badge--cyan",
  Critical: "status-badge--magenta",
};

export default function StatusBadge({ label }) {
  const toneClass = toneMap[label] ?? "status-badge--muted";

  return <span className={`status-badge ${toneClass}`}>{label}</span>;
}
