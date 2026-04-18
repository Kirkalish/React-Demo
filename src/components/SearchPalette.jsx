import React, { useEffect, useMemo, useRef, useState } from "react";

function SearchPaletteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="search-palette__icon">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export default function SearchPalette({
  open,
  onClose,
  onOpenSettings,
  onToggleAlert,
  redAlert,
  missions,
  crew,
  navigate,
}) {
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [open]);

  const results = useMemo(() => {
    const commands = [
      {
        id: "route-dashboard",
        group: "Navigation",
        label: "Open mission control dashboard",
        description: "Return to the operations overview.",
        keywords: "home dashboard mission control overview",
        onSelect: () => navigate("/"),
      },
      {
        id: "route-missions",
        group: "Navigation",
        label: "Open mission registry",
        description: "Jump into mission filters and active assignments.",
        keywords: "missions registry operations",
        onSelect: () => navigate("/missions"),
      },
      {
        id: "route-crew",
        group: "Navigation",
        label: "Open explorer roster",
        description: "Review crew dossiers, status, and assignments.",
        keywords: "crew roster explorers personnel",
        onSelect: () => navigate("/crew"),
      },
      {
        id: "action-alert",
        group: "Actions",
        label: redAlert ? "Disable red alert" : "Enable red alert",
        description: redAlert
          ? "Return thresholds to nominal operating levels."
          : "Shift the deck into critical failure simulation.",
        keywords: "red alert toggle state",
        onSelect: onToggleAlert,
      },
      {
        id: "action-settings",
        group: "Actions",
        label: "Open settings",
        description: "Adjust saved preferences, themes, and local state.",
        keywords: "settings preferences theme accessibility",
        onSelect: onOpenSettings,
      },
      ...missions.map((mission) => ({
        id: `mission-${mission.id}`,
        group: "Missions",
        label: mission.name,
        description: `${mission.region} · ${mission.status} · ${mission.priority}`,
        keywords: `${mission.name} ${mission.region} ${mission.category} ${mission.status} ${mission.priority}`,
        onSelect: () => navigate(`/missions/${mission.id}`),
      })),
      ...crew.map((member) => ({
        id: `crew-${member.id}`,
        group: "Crew",
        label: member.name,
        description: `${member.role} · ${member.status} · ${member.specialty}`,
        keywords: `${member.name} ${member.role} ${member.status} ${member.specialty}`,
        onSelect: () => navigate(`/crew/${member.id}`),
      })),
    ];

    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return commands.slice(0, 10);
    }

    return commands
      .filter((item) => {
        const haystack = `${item.label} ${item.description} ${item.keywords}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .slice(0, 12);
  }, [crew, missions, navigate, onOpenSettings, onToggleAlert, query, redAlert]);

  if (!open) {
    return null;
  }

  return (
    <div className="search-palette" role="dialog" aria-modal="true" aria-labelledby="search-palette-title">
      <div className="search-palette__backdrop" onClick={onClose} />
      <div className="search-palette__panel">
        <div className="search-palette__header">
          <div>
            <p className="eyebrow">Command palette</p>
            <h2 id="search-palette-title">Search deck navigation and actions</h2>
          </div>
          <button
            type="button"
            className="crew-modal__close"
            onClick={onClose}
            aria-label="Close search palette"
          >
            Close
          </button>
        </div>

        <label className="search-palette__field">
          <span className="search-palette__label">Search missions, crew, and commands</span>
          <div className="search-palette__input-shell">
            <SearchPaletteIcon />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type a route, crew member, mission, or command"
            />
            <span className="search-palette__hint">Ctrl/Cmd + K</span>
          </div>
        </label>

        <div className="search-palette__results" role="list">
          {results.length ? (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                className="search-palette__result"
                onClick={() => {
                  item.onSelect();
                  onClose();
                }}
              >
                <span className="search-palette__result-group">{item.group}</span>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </button>
            ))
          ) : (
            <div className="search-palette__empty">
              <p className="eyebrow">No result</p>
              <h3>No matches in the current command index</h3>
              <p>Try a mission region, explorer name, or a command like settings or alert.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
