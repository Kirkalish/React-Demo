import React from "react";
import { Link } from "react-router-dom";
import ActivityFeed from "../components/ActivityFeed";
import CrewCard from "../components/CrewCard";
import ResourceMeter from "../components/ResourceMeter";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { alerts, crew, missions, resources, transmissions } from "../data/galaktikData";

const stats = [
  { label: "Active missions", value: "04", trend: "+1 since previous cycle", tone: "cyan" },
  { label: "Explorers assigned", value: "06", trend: "2 teams deployed off-station", tone: "violet" },
  { label: "High-severity alerts", value: "03", trend: "Security focus at Atlas Rim", tone: "magenta" },
  { label: "Trade corridor uptime", value: "99.2%", trend: "Stable commerce routing", tone: "gold" },
];

export default function DashboardPage() {
  return (
    <div className="dashboard-grid">
      <section className="dashboard-grid__hero panel panel--hero">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Sector overview</p>
            <h2>Galaktik network readiness remains within green thresholds.</h2>
          </div>
          <StatusBadge label="Active" />
        </div>

        <p className="panel__lede">
          A portfolio-ready sci-fi operations dashboard built to feel like a real product:
          card systems, mission flows, responsive panels, and data-rich UI without backend
          complexity.
        </p>

        <div className="hero-grid__stats">
          {stats.map((stat) => (
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

      <ActivityFeed items={alerts} title="Alerts and signal traffic" />

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

      <ActivityFeed items={transmissions} title="Recent transmissions" compact />
    </div>
  );
}
