import React from "react";
import { Link } from "react-router-dom";
import ActivityFeed from "../components/ActivityFeed";
import CrewCard from "../components/CrewCard";
import ResourceMeter from "../components/ResourceMeter";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { useAlertMode } from "../context/AlertModeContext";

export default function DashboardPage() {
  const { redAlert, data } = useAlertMode();
  const { alerts, crew, metrics, missions, resources, transmissions } = data;

  return (
    <div className="dashboard-grid">
      <section className="dashboard-grid__hero panel panel--hero">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Sector overview</p>
            <h2>
              {redAlert
                ? "Galaktik network readiness has fallen into multi-sector critical failure."
                : "Galaktik network readiness remains within green thresholds."}
            </h2>
          </div>
          <StatusBadge label={redAlert ? "Critical" : "Active"} />
        </div>

        <p className="panel__lede">
          {redAlert
            ? "Red alert mode simulates a degraded operating state with lower reserves, critical missions, unstable crew performance, and higher-severity system traffic."
            : "A portfolio-ready sci-fi operations dashboard built to feel like a real product: card systems, mission flows, responsive panels, and data-rich UI without backend complexity."}
        </p>

        <div className="hero-grid__stats">
          {metrics.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Resources</p>
            <h2>Operational reserves</h2>
          </div>
        </div>

        <div className="resource-stack">
          {resources.map((resource) => (
            <ResourceMeter key={resource.id} resource={resource} />
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Mission focus</p>
            <h2>Priority operations</h2>
          </div>
          <Link className="text-link" to="/missions">
            Open registry
          </Link>
        </div>

        <div className="mission-spotlight">
          {missions.slice(0, 3).map((mission) => (
            <Link key={mission.id} className="mission-spotlight__card" to={`/missions/${mission.id}`}>
              <div className="mission-spotlight__meta">
                <StatusBadge label={mission.status} />
                <StatusBadge label={mission.priority} />
              </div>
              <h3>{mission.name}</h3>
              <p>{mission.summary}</p>
              <small>
                {mission.region}
                <span>{mission.reward}</span>
              </small>
            </Link>
          ))}
        </div>
      </section>

      <ActivityFeed
        items={alerts}
        eyebrow={redAlert ? "Red alert feed" : "Live feed"}
        title={redAlert ? "Critical incidents and sector failures" : "Alerts and signal traffic"}
        description={
          redAlert
            ? "This channel is now prioritizing distress events, infrastructure failures, and emergency escalation."
            : "Live operational events across security, mission, trade, and medical channels."
        }
        tone={redAlert ? "alert" : "default"}
      />

      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Crew</p>
            <h2>Assigned explorers</h2>
          </div>
          <Link className="text-link" to="/crew">
            Full roster
          </Link>
        </div>

        <div className="crew-grid">
          {crew.slice(0, 4).map((member) => (
            <CrewCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      <ActivityFeed
        items={transmissions}
        eyebrow={redAlert ? "Emergency comms" : "Live feed"}
        title={redAlert ? "Distress transmissions" : "Recent transmissions"}
        description={
          redAlert
            ? "Inbound comms have shifted from routine updates to failure reports and reroute notices."
            : "Recent outbound and inbound communications across the Galaktik network."
        }
        compact
        tone={redAlert ? "alert" : "default"}
      />
    </div>
  );
}
