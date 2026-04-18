import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useAlertMode } from "../context/AlertModeContext";

function SearchPaletteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="search-palette__icon">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function highlightMatch(text, query) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return text;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = normalizedQuery.toLowerCase();
  const matchIndex = lowerText.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return text;
  }

  const start = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + normalizedQuery.length);
  const end = text.slice(matchIndex + normalizedQuery.length);

  return (
    <>
      {start}
      <mark className="search-palette__mark">{match}</mark>
      {end}
    </>
  );
}

function scoreResult(item, normalizedQuery) {
  const haystack = `${item.label} ${item.description} ${item.keywords}`.toLowerCase();
  const label = item.label.toLowerCase();

  if (label.startsWith(normalizedQuery)) {
    return 0;
  }

  if (label.includes(normalizedQuery)) {
    return 1;
  }

  if (haystack.includes(normalizedQuery)) {
    return 2;
  }

  return 3;
}

export default function SearchPalette({
  open,
  onClose,
  onOpenSettings,
  redAlert,
  missions,
  crew,
  navigate,
  recentCommands,
  onRegisterCommand,
  onExecuteSimulation,
}) {
  const inputRef = useRef(null);
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [shouldRender, setShouldRender] = useState(open);
  const {
    preferences: {
      accessibility: { reduceMotion },
    },
  } = useAlertMode();

  const allCommands = useMemo(
    () => [
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
        onSelect: () => onExecuteSimulation("toggle-alert"),
      },
      {
        id: "action-settings",
        group: "Actions",
        label: "Open settings",
        description: "Adjust saved preferences, themes, and local state.",
        keywords: "settings preferences theme accessibility",
        onSelect: onOpenSettings,
      },
      {
        id: "toggle-alert",
        group: "Simulation",
        label: redAlert ? "Simulate nominal recovery" : "Simulate red alert state",
        description: redAlert
          ? "Restore standard operating thresholds from the palette."
          : "Push the live deck into critical-response state.",
        keywords: "simulation alert nominal recovery",
        onSelect: () => onExecuteSimulation("toggle-alert"),
      },
      {
        id: "sector-lockdown",
        group: "Simulation",
        label: "Run sector lockdown drill",
        description: "Escalate Atlas Gate and route the view to the registry.",
        keywords: "simulation lockdown atlas registry",
        onSelect: () => {
          onExecuteSimulation("sector-lockdown");
          navigate("/missions");
        },
      },
      {
        id: "readiness-drill",
        group: "Simulation",
        label: "Run crew readiness drill",
        description: "Adjust roster readiness and open explorer operations.",
        keywords: "simulation crew roster drill",
        onSelect: () => {
          onExecuteSimulation("readiness-drill");
          navigate("/crew");
        },
      },
      {
        id: "telemetry-sweep",
        group: "Simulation",
        label: "Broadcast telemetry sweep",
        description: "Inject a diagnostics event into the live feeds.",
        keywords: "simulation diagnostics telemetry sweep",
        onSelect: () => onExecuteSimulation("telemetry-sweep"),
      },
      {
        id: "comms-blackout",
        group: "Simulation",
        label: "Stage communications blackout",
        description: "Push Orion relay lanes into blackout response mode.",
        keywords: "simulation communications blackout orion relay",
        onSelect: () => {
          onExecuteSimulation("comms-blackout");
          navigate("/");
        },
      },
      {
        id: "restore-nominal",
        group: "Simulation",
        label: "Restore baseline simulation",
        description: "Reset drills and recover the default scenario state.",
        keywords: "simulation restore reset baseline",
        onSelect: () => {
          onExecuteSimulation("restore-nominal");
          navigate("/");
        },
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
    ],
    [crew, missions, navigate, onExecuteSimulation, onOpenSettings, redAlert],
  );

  const resultSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const recentLookup = new Set(recentCommands.map((item) => item.id));
    const recentResults = recentCommands
      .map((item) => allCommands.find((command) => command.id === item.id))
      .filter(Boolean);
    const filtered = normalizedQuery
      ? allCommands
          .filter((item) => {
            const haystack = `${item.label} ${item.description} ${item.keywords}`.toLowerCase();
            return haystack.includes(normalizedQuery);
          })
          .sort((left, right) => scoreResult(left, normalizedQuery) - scoreResult(right, normalizedQuery))
      : allCommands;

    const sections = [];

    if (!normalizedQuery && recentResults.length) {
      sections.push({
        id: "recent",
        title: "Recent commands",
        items: recentResults.slice(0, 5),
      });
    }

    ["Navigation", "Actions", "Simulation", "Missions", "Crew"].forEach((group) => {
      const groupItems = filtered.filter(
        (item) => item.group === group && (normalizedQuery || !recentLookup.has(item.id)),
      );

      if (!groupItems.length) {
        return;
      }

      sections.push({
        id: group.toLowerCase(),
        title: group,
        items: groupItems.slice(0, normalizedQuery ? 8 : group === "Simulation" ? 4 : 5),
      });
    });

    return sections;
  }, [allCommands, query, recentCommands]);

  const flatResults = useMemo(
    () => resultSections.flatMap((section) => section.items),
    [resultSections],
  );

  useEffect(() => {
    if (open) {
      setShouldRender(true);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useLayoutEffect(() => {
    if (!shouldRender || !panelRef.current || !backdropRef.current) {
      return;
    }

    if (reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([backdropRef.current, panelRef.current], { clearProps: "transform,opacity,visibility" });
      if (!open) {
        setShouldRender(false);
      }
      return;
    }

    let timeline;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const header = panel.querySelector(".search-palette__header");
    const field = panel.querySelector(".search-palette__field");
    const sections = panel.querySelectorAll(".search-palette__section, .search-palette__empty");

    if (open) {
      gsap.set(backdrop, { autoAlpha: 0 });
      gsap.set(panel, { autoAlpha: 0, y: 18, scale: 0.985, transformOrigin: "center center" });
      if (header) {
        gsap.set(header, { autoAlpha: 0, y: 10 });
      }
      if (field) {
        gsap.set(field, { autoAlpha: 0, y: 12 });
      }
      if (sections.length) {
        gsap.set(sections, { autoAlpha: 0, y: 14 });
      }

      timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.to(backdrop, { autoAlpha: 1, duration: 0.18 }, 0);
      timeline.to(
        panel,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.24,
        },
        0,
      );

      if (header) {
        timeline.to(
          header,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.18,
          },
          "-=0.12",
        );
      }

      if (field) {
        timeline.to(
          field,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.2,
          },
          "-=0.1",
        );
      }

      if (sections.length) {
        timeline.to(
          sections,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.22,
            stagger: 0.04,
            clearProps: "transform,opacity,visibility",
          },
          "-=0.06",
        );
      }
    } else {
      timeline = gsap.timeline({
        defaults: {
          ease: "power2.inOut",
        },
        onComplete: () => {
          setShouldRender(false);
        },
      });

      timeline.to(sections, { autoAlpha: 0, y: 8, duration: 0.12, stagger: 0.02 }, 0);
      if (field) {
        timeline.to(field, { autoAlpha: 0, y: 8, duration: 0.12 }, 0.02);
      }
      if (header) {
        timeline.to(header, { autoAlpha: 0, y: 8, duration: 0.12 }, 0.04);
      }
      timeline.to(
        panel,
        {
          autoAlpha: 0,
          y: 12,
          scale: 0.985,
          duration: 0.18,
        },
        0.02,
      );
      timeline.to(backdrop, { autoAlpha: 0, duration: 0.18 }, 0);
    }

    return () => {
      timeline.kill();
      gsap.set([backdrop, panel], { clearProps: "transform,opacity,visibility" });
      if (header) {
        gsap.set(header, { clearProps: "transform,opacity,visibility" });
      }
      if (field) {
        gsap.set(field, { clearProps: "transform,opacity,visibility" });
      }
      if (sections.length) {
        gsap.set(sections, { clearProps: "transform,opacity,visibility" });
      }
    };
  }, [open, reduceMotion]);

  const selectItem = (item) => {
    onRegisterCommand({
      id: item.id,
      label: item.label,
      description: item.description,
      group: item.group,
    });
    item.onSelect();
    onClose();
  };

  if (!shouldRender) {
    return null;
  }

  return (
    <div className="search-palette" role="dialog" aria-modal="true" aria-labelledby="search-palette-title">
      <div ref={backdropRef} className="search-palette__backdrop" onClick={onClose} />
      <div ref={panelRef} className="search-palette__panel">
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
              onKeyDown={(event) => {
                if (!flatResults.length) {
                  return;
                }

                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActiveIndex((current) => (current + 1) % flatResults.length);
                }

                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActiveIndex((current) => (current - 1 + flatResults.length) % flatResults.length);
                }

                if (event.key === "Enter") {
                  event.preventDefault();
                  selectItem(flatResults[activeIndex]);
                }
              }}
              placeholder="Type a route, crew member, mission, or command"
            />
            <span className="search-palette__hint">Ctrl/Cmd + K</span>
          </div>
        </label>

        <div className="search-palette__results" role="listbox" aria-label="Command palette results">
          {resultSections.length ? (
            resultSections.map((section) => (
              <section key={section.id} className="search-palette__section" aria-label={section.title}>
                <div className="search-palette__section-header">
                  <span>{section.title}</span>
                </div>
                <div className="search-palette__section-results">
                  {section.items.map((item) => {
                    const itemIndex = flatResults.findIndex((entry) => entry.id === item.id);
                    const isActive = itemIndex === activeIndex;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        className={isActive ? "search-palette__result search-palette__result--active" : "search-palette__result"}
                        onMouseEnter={() => setActiveIndex(itemIndex)}
                        onClick={() => selectItem(item)}
                      >
                        <span className="search-palette__result-group">{item.group}</span>
                        <strong>{highlightMatch(item.label, query)}</strong>
                        <small>{highlightMatch(item.description, query)}</small>
                      </button>
                    );
                  })}
                </div>
              </section>
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
