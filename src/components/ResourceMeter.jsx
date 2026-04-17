import React from "react";

export default function ResourceMeter({ resource }) {
  const percent = Math.round((resource.current / resource.capacity) * 100);

  return (
    <article className="resource-meter">
      <div className="resource-meter__header">
        <div>
          <p>{resource.label}</p>
          <strong>
            {resource.current}/{resource.capacity}
          </strong>
        </div>
        <span className={`resource-meter__tag resource-meter__tag--${resource.tone}`}>
          {percent}%
        </span>
      </div>

      <div className="resource-meter__track" aria-hidden="true">
        <div
          className={`resource-meter__fill resource-meter__fill--${resource.tone}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <small>{resource.detail}</small>
    </article>
  );
}
