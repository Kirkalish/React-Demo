import React from "react";
import StatusBadge from "./StatusBadge";

export default function ActivityFeed({ items, title, compact = false }) {
  return (
    <section className={`panel activity-feed ${compact ? "activity-feed--compact" : ""}`}>
      <div className="panel__header">
        <div>
          <p className="eyebrow">Live feed</p>
          <h2>{title}</h2>
        </div>
      </div>

      <div className="activity-feed__list">
        {items.map((item) => (
          <article key={item.id} className="activity-feed__item">
            <div>
              <strong>{item.title}</strong>
              {"type" in item ? (
                <p>
                  {item.type} channel
                  <span>{item.timestamp}</span>
                </p>
              ) : (
                <p>
                  {item.source}
                  <span>{item.status}</span>
                </p>
              )}
            </div>

            {"severity" in item ? <StatusBadge label={item.severity} /> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
