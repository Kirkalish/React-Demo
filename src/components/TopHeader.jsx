import React from "react";
import { useLocation } from "react-router-dom";

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
  const detailMatch = location.pathname.startsWith("/missions/");
  const meta = detailMatch
    ? {
        title: "Mission Detail",
        description: "Objectives, crew, costs, and timeline for the selected operation.",
      }
    : pageMeta[location.pathname] ?? pageMeta["/"];

  return (
    <header className="top-header">
      <div>
        <p className="eyebrow">Galaktik React Demo</p>
        <h1>{meta.title}</h1>
        <p className="top-header__description">{meta.description}</p>
      </div>

      <div className="top-header__status">
        <div className="status-chip">
          <span className="status-chip__dot" />
          Systems nominal
        </div>
        <div className="status-chip status-chip--muted">Cycle 214.77</div>
      </div>
    </header>
  );
}
