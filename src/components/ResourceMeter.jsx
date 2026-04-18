import React from "react";

export default function ResourceMeter({ resource }) {
  const percent = Math.round((resource.current / resource.capacity) * 100);
  const titleId = `resource-${resource.id}-label`;
  const detailId = `resource-${resource.id}-detail`;

  return (
    <article className="resource-meter">
      <div className="resource-meter__header">
        <div>
          <p id={titleId}>{resource.label}</p>
          <strong>
            {resource.current}/{resource.capacity}
          </strong>
        </div>
        <span className={`resource-meter__tag resource-meter__tag--${resource.tone}`}>
          {percent}%
        </span>
      </div>

      <div
        className="resource-meter__track"
        role="progressbar"
        aria-labelledby={titleId}
        aria-describedby={detailId}
        aria-valuemin={0}
        aria-valuemax={resource.capacity}
        aria-valuenow={resource.current}
        aria-valuetext={`${percent}% capacity`}
      >
        <div
          className={`resource-meter__fill resource-meter__fill--${resource.tone}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <small id={detailId}>{resource.detail}</small>
    </article>
  );
}
