import React, { useMemo } from "react";
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
  const operationsFeed = useMemo(() => {
    const normalizedAlerts = alerts.map((item, index) => ({
      ...item,
      feedKind: "alert",
      sortIndex: index * 2,
    }));
    const normalizedTransmissions = transmissions.map((item, index) => ({
      ...item,
      feedKind: "transmission",
      sortIndex: index * 2 + 1,
    }));

    return [...normalizedAlerts, ...normalizedTransmissions]
      .sort((left, right) => left.sortIndex - right.sortIndex)
      .map(({ sortIndex, ...item }) => item);
  }, [alerts, transmissions]);
  const operationFilters = useMemo(
    () => [
      { id: "all", label: "All", predicate: () => true },
      { id: "alerts", label: "Alerts", predicate: (item) => item.feedKind === "alert" },
      {
        id: "transmissions",
        label: "Transmissions",
        predicate: (item) => item.feedKind === "transmission",
      },
      {
        id: "mission-linked",
        label: "Mission-linked",
        predicate: (item) => Boolean(item.missionId),
      },
    ],
    [],
  );

  return (
    <div className="dashboard-grid">
      <div className="dashboard-grid__primary">
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
      </div>

      <div className="dashboard-grid__secondary">
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

        <ActivityFeed
          items={operationsFeed}
          eyebrow={redAlert ? "Operations feed" : "Live operations"}
          title={redAlert ? "Incidents, distress comms, and sector failures" : "Alerts, transmissions, and signal traffic"}
          description={
            redAlert
              ? "A unified command stream for distress events, infrastructure failures, and emergency communications."
              : "A unified command stream across security, mission, trade, medical, and outbound comms."
          }
          filterOptions={operationFilters}
          tone={redAlert ? "alert" : "default"}
        />
      </div>
    </div>
  );
}
