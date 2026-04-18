import React from "react";
import { useDeferredValue, useState } from "react";
import EmptyState from "../components/EmptyState";
import MissionManagerModal from "../components/MissionManagerModal";
import MissionTable from "../components/MissionTable";
import { useAlertMode } from "../context/AlertModeContext";

function MissionControlsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="crew-controls__icon">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
      <circle cx="12" cy="12" r="7.5" />
    </svg>
  );
}

export default function MissionsPage() {
  const {
    data: { missions },
  } = useAlertMode();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [createOpen, setCreateOpen] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const filteredMissions = missions.filter((mission) => {
    const matchesQuery =
      deferredQuery.trim() === "" ||
      mission.name.toLowerCase().includes(deferredQuery.toLowerCase()) ||
      mission.region.toLowerCase().includes(deferredQuery.toLowerCase()) ||
      mission.category.toLowerCase().includes(deferredQuery.toLowerCase());
    const matchesStatus = status === "All" || mission.status === status;
    const matchesPriority = priority === "All" || mission.priority === priority;

    return matchesQuery && matchesStatus && matchesPriority;
  });

  return (
    <>
    <div className="stack-layout stack-layout--missions">
      <section className="panel filter-panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Registry controls</p>
            <h2>Mission search and filtering</h2>
          </div>
          <button
            type="button"
            className="crew-controls__button"
            aria-label="Create mission"
            onClick={() => setCreateOpen(true)}
          >
            <MissionControlsIcon />
          </button>
        </div>

        <div className="filter-panel__controls">
          <label>
            Search missions
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by mission, region, or category"
            />
          </label>

          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option>All</option>
              <option>Active</option>
              <option>Planning</option>
              <option>Alert</option>
              <option>Standby</option>
            </select>
          </label>

          <label>
            Priority
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option>All</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
            </select>
          </label>
        </div>
      </section>

      <section className="panel panel--fill">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Mission list</p>
            <h2>{filteredMissions.length} operations visible</h2>
          </div>
        </div>

        {filteredMissions.length > 0 ? (
          <MissionTable missions={filteredMissions} />
        ) : (
          <EmptyState
            title="No missions matched the current filters."
            text="Try widening the search or clearing one of the status or priority controls."
          />
        )}
      </section>
    </div>
    <MissionManagerModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
