import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function MissionTable({ missions }) {
  return (
    <div className="mission-table">
      <div className="mission-table__header mission-table__row">
        <span>Mission</span>
        <span>Status</span>
        <span>Priority</span>
        <span>Region</span>
        <span>Reward</span>
      </div>

      {missions.map((mission) => (
        <Link
          key={mission.id}
          to={`/missions/${mission.id}`}
          className="mission-table__row mission-table__row--link"
          aria-label={`Open ${mission.name}, ${mission.status} status, ${mission.priority} priority, in ${mission.region}`}
        >
          <div>
            <strong>{mission.name}</strong>
            <p>{mission.category}</p>
          </div>
          <StatusBadge label={mission.status} />
          <StatusBadge label={mission.priority} />
          <span>{mission.region}</span>
          <span>{mission.reward}</span>
        </Link>
      ))}
    </div>
  );
}
