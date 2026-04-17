import React from "react";

export default function StatCard({ label, value, trend, tone = "cyan" }) {
  const isPercentValue = typeof value === "string" && value.endsWith("%");
  const displayValue = isPercentValue ? value.slice(0, -1) : value;

  return (
    <article className={`panel stat-card stat-card--${tone}`}>
      <p>{label}</p>
      <strong>
        {displayValue}
        {isPercentValue ? <small>%</small> : null}
      </strong>
      <span>{trend}</span>
    </article>
  );
}
