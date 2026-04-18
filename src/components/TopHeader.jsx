import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAlertMode } from "../context/AlertModeContext";

const pageMeta = {
  "/": {
    title: "Mission Control Dashboard",
    description: "Live operational view across active sectors, crews, and system alerts.",
  },
  "/missions": {
    title: "Mission Registry",
    description: "Search, filter, and monitor active assignments across the Galaktik network.",
  },
  "/crew": {
    title: "Explorer Roster",
    description: "Crew specialization, assignments, and operational status at a glance.",
  },
};

export default function TopHeader() {
  const location = useLocation();
  const { redAlert, data } = useAlertMode();
  const detailMatch = location.pathname.startsWith("/missions/");
  const crewDetailMatch = location.pathname.startsWith("/crew/");
  const compactHeader = location.pathname !== "/";
  const meta = detailMatch
    ? {
        title: "Mission Detail",
        description: "Objectives, crew, costs, and timeline for the selected operation.",
      }
    : crewDetailMatch
      ? {
          title: "Crew Dossier",
          description: "Explorer profile, assignment context, certifications, and live field status.",
        }
      : pageMeta[location.pathname] ?? pageMeta["/"];

  useEffect(() => {
    document.title = `${meta.title} | Galaktik React Demo`;
  }, [meta.title]);

  return (
    <header className={compactHeader ? "top-header top-header--compact" : "top-header"}>
      <div>
        <p className="eyebrow">Galaktik React Demo</p>
        <h1>{meta.title}</h1>
        <p className="top-header__description">{meta.description}</p>
      </div>

      <div className="top-header__status">
        <div
          className={redAlert ? "status-chip status-chip--alert" : "status-chip"}
          role="status"
          aria-live="polite"
        >
          <span className="status-chip__dot" />
          {data.networkLabel}
        </div>
        <div className="status-chip status-chip--muted">{data.cycleLabel}</div>
      </div>
    </header>
  );
}
