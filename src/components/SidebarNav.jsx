import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Mission Control", shortLabel: "MC" },
  { to: "/missions", label: "Missions", shortLabel: "MS" },
  { to: "/crew", label: "Crew", shortLabel: "CR" },
];

export default function SidebarNav() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__crest">GX</div>
        <div>
          <strong>Galaktik</strong>
          <p>Mission Control</p>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Primary">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            <span>{link.shortLabel}</span>
            <b>{link.label}</b>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <p>Fleet readiness</p>
        <strong>92%</strong>
        <small>Operational confidence across active sectors</small>
      </div>
    </aside>
  );
}
