import React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CrewCard from "../components/CrewCard";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import { useAlertMode } from "../context/AlertModeContext";
import { getCrewByMission, getMissionById } from "../data/galaktikData";

export default function MissionDetailPage() {
  const { missionId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const {
    data: { crew, missions },
  } = useAlertMode();
  const mission = missionId ? getMissionById(missions, missionId) : null;
  const assignedCrew = missionId ? getCrewByMission(crew, missionId) : [];

  useEffect(() => {
    setIsLoading(true);
    const timerId = window.setTimeout(() => {
      setIsLoading(false);
    }, 360);

    return () => window.clearTimeout(timerId);
  }, [missionId]);

  if (isLoading) {
    return (
      <section className="panel loading-panel">
        <p className="eyebrow">Fetching mission payload</p>
        <h2>Syncing sector data...</h2>
      </section>
    );
  }

  if (!mission) {
    return (
      <EmptyState
        title="Mission signal not found."
        text="The requested operation does not exist in the current Galaktik demo dataset."
      />
    );
  }

  return (
    <div className="stack-layout">
      <section className="panel detail-hero">
        <div className="panel__header">
          <div>
            <p className="eyebrow">{mission.category}</p>
            <h2>{mission.name}</h2>
          </div>
          <div className="detail-hero__badges">
            <StatusBadge label={mission.status} />
            <StatusBadge label={mission.priority} />
          </div>
        </div>

        <p className="panel__lede">{mission.summary}</p>

        <div className="detail-hero__meta">
          <div>
            <span>Region</span>
            <strong>{mission.region}</strong>
          </div>
          <div>
            <span>Reward</span>
            <strong>{mission.reward}</strong>
          </div>
          <div>
            <span>Difficulty</span>
            <strong>{mission.difficulty}</strong>
          </div>
          <div>
            <span>Opened</span>
            <strong>{mission.startedAt}</strong>
          </div>
        </div>
      </section>

      <div className="detail-layout">
        <section className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Objectives</p>
              <h2>Mission checklist</h2>
            </div>
          </div>

          <ul className="detail-list">
            {mission.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Resource cost</p>
              <h2>Deployment budget</h2>
            </div>
          </div>

          <dl className="detail-metrics">
            <div>
              <dt>Fuel allocation</dt>
              <dd>{mission.resourceCost.fuel}</dd>
            </div>
            <div>
              <dt>Quantum core use</dt>
              <dd>{mission.resourceCost.cores}</dd>
            </div>
            <div>
              <dt>Medical reserve</dt>
              <dd>{mission.resourceCost.med}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Timeline</p>
            <h2>Status progression</h2>
          </div>
          <Link className="text-link" to="/missions">
            Back to registry
          </Link>
        </div>

        <div className="timeline">
          {mission.timeline.map((entry) => (
            <article key={`${entry.label}-${entry.time}`} className="timeline__item">
              <div className="timeline__marker" />
              <div>
                <strong>{entry.label}</strong>
                <p>{entry.time}</p>
              </div>
              <StatusBadge label={entry.state} />
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Assigned crew</p>
            <h2>Explorer team</h2>
          </div>
        </div>

        <div className="crew-grid">
          {assignedCrew.map((member) => (
            <CrewCard key={member.id} member={member} />
          ))}
        </div>
      </section>
    </div>
  );
}
