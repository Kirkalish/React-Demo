import React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import { useAlertMode } from "../context/AlertModeContext";
import {
  getCrewMemberById,
  getCrewProfile,
  getMissionById,
} from "../data/galaktikData";

export default function CrewDetailPage() {
  const { memberId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const {
    data: { crew, missions },
  } = useAlertMode();
  const member = memberId ? getCrewMemberById(crew, memberId) : null;
  const mission = member ? getMissionById(missions, member.missionId) : null;
  const profile = member ? getCrewProfile(member.id) : null;

  useEffect(() => {
    setIsLoading(true);
    const timerId = window.setTimeout(() => {
      setIsLoading(false);
    }, 320);

    return () => window.clearTimeout(timerId);
  }, [memberId]);

  if (isLoading) {
    return (
      <section className="panel loading-panel" role="status" aria-live="polite">
        <p className="eyebrow">Syncing crew dossier</p>
        <h2>Pulling explorer profile...</h2>
      </section>
    );
  }

  if (!member || !profile) {
    return (
      <EmptyState
        title="Crew dossier not found."
        text="The requested explorer does not exist in the current Galaktik crew dataset."
      />
    );
  }

  return (
    <div className="stack-layout">
      <section className="panel detail-hero">
        <div className="panel__header">
          <div className="crew-detail__identity">
            <div className="crew-detail__avatar">{member.name.slice(0, 2).toUpperCase()}</div>
            <div>
              <p className="eyebrow">{profile.callsign}</p>
              <h2>{member.name}</h2>
            </div>
          </div>
          <div className="detail-hero__actions">
            <Link className="text-link" to="/crew">
              Back to roster
            </Link>
            <div className="detail-hero__badges">
              <StatusBadge label={member.status} />
              <StatusBadge label={`Level ${member.level}`} tone="muted" />
            </div>
          </div>
        </div>

        <p className="panel__lede">{profile.bio}</p>

        <div className="detail-hero__meta">
          <div>
            <span>Role</span>
            <strong>{member.role}</strong>
          </div>
          <div>
            <span>Specialty</span>
            <strong>{member.specialty}</strong>
          </div>
          <div>
            <span>Efficiency</span>
            <strong>{member.efficiency}</strong>
          </div>
          <div>
            <span>Comms</span>
            <strong>{profile.commsChannel}</strong>
          </div>
        </div>
      </section>

      <div className="detail-layout">
        <section className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Profile</p>
              <h2>Assignment context</h2>
            </div>
          </div>

          <dl className="detail-metrics">
            <div>
              <dt>Home sector</dt>
              <dd>{profile.homeSector}</dd>
            </div>
            <div>
              <dt>Clearance</dt>
              <dd>{profile.clearance}</dd>
            </div>
            <div>
              <dt>Current mission</dt>
              <dd>{mission ? mission.name : "Unassigned"}</dd>
            </div>
          </dl>

          {mission ? (
            <Link className="text-link crew-detail__link" to={`/missions/${mission.id}`}>
              Open mission brief
            </Link>
          ) : null}
        </section>

        <section className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Capabilities</p>
              <h2>Certifications</h2>
            </div>
          </div>

          <div className="crew-detail__chips">
            {profile.certifications.map((item) => (
              <StatusBadge key={item} label={item} tone="muted" />
            ))}
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Field notes</p>
            <h2>Operational summary</h2>
          </div>
        </div>

        <div className="crew-detail__notes">
          <p>
            {member.name} is currently flagged as <strong>{member.status}</strong> and routed
            through <strong>{profile.commsChannel}</strong> for live coordination.
          </p>
          <p>
            Current specialty focus is <strong>{member.specialty}</strong>, with mission efficiency
            tracked at <strong>{member.efficiency}</strong>.
          </p>
          <p>
            {mission
              ? `Assigned operation remains ${mission.name} in ${mission.region}, where ${member.role.toLowerCase()} coverage is active.`
              : "No active mission link is available for this explorer in the current dataset."}
          </p>
        </div>
      </section>
    </div>
  );
}
