import React from "react";
import { Link } from "react-router-dom";
import { useAlertMode } from "../context/AlertModeContext";
import { getMissionName } from "../data/galaktikData";
import StatusBadge from "./StatusBadge";

export default function CrewCard({ member }) {
  const {
    data: { missions },
  } = useAlertMode();

  return (
    <article className="panel crew-card">
      <div className="crew-card__header">
        <div className="crew-card__avatar">{member.name.slice(0, 2).toUpperCase()}</div>
        <StatusBadge label={member.status} />
      </div>

      <h3>{member.name}</h3>
      <p className="crew-card__role">
        {member.role}
        <span>Level {member.level}</span>
      </p>

      <dl className="crew-card__stats">
        <div>
          <dt>Specialty</dt>
          <dd>{member.specialty}</dd>
        </div>
        <div>
          <dt>Efficiency</dt>
          <dd>{member.efficiency}</dd>
        </div>
      </dl>

      <Link className="text-link" to={`/missions/${member.missionId}`}>
        Assigned to {getMissionName(missions, member.missionId)}
      </Link>
    </article>
  );
}
