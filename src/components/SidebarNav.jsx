import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAlertMode } from "../context/AlertModeContext";

function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="sidebar__icon sidebar__icon--brand">
      <defs>
        <clipPath id="planet-clip">
          <circle cx="30" cy="31" r="14" />
        </clipPath>
      </defs>
      <ellipse cx="32" cy="33" rx="25" ry="9.5" fill="none" />
      <circle cx="30" cy="31" r="14" />
      <g clipPath="url(#planet-clip)">
        <path d="M16 31h28" />
        <path d="M19 25h22" />
        <path d="M19 37h22" />
        <path d="M30 17c-3 4-4.5 9-4.5 14s1.5 10 4.5 14" />
        <path d="M30 17c3 4 4.5 9 4.5 14s-1.5 10-4.5 14" />
      </g>
      <circle cx="47" cy="21" r="2.5" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="sidebar__icon">
      <path d="M4.5 6.5h6v4h-6z" />
      <path d="M13.5 6.5h6v7h-6z" />
      <path d="M4.5 13.5h6v6h-6z" />
      <path d="M13.5 16.5h6v3h-6z" />
    </svg>
  );
}

function MissionIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="sidebar__icon">
      <circle cx="12" cy="12" r="6.5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2.5v3" />
      <path d="M12 18.5v3" />
      <path d="M2.5 12h3" />
      <path d="M18.5 12h3" />
      <path d="M16.2 7.8l2.3-2.3" />
    </svg>
  );
}

function PersonnelIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="sidebar__icon">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 18.5c1.3-3.3 4-5 6.5-5s5.2 1.7 6.5 5" />
      <path d="M4.5 18.5h15" />
    </svg>
  );
}

const links = [
  { to: "/", label: "Mission Control", Icon: DashboardIcon },
  { to: "/missions", label: "Missions", Icon: MissionIcon },
  { to: "/crew", label: "Crew", Icon: PersonnelIcon },
];

export default function SidebarNav(props) {
  const { redAlert, data } = useAlertMode();

  return (
    <aside {...props} className="sidebar" aria-label="Sidebar">
      <Link className="sidebar__brand" to="/" aria-label="Go to mission control dashboard">
        <div className="sidebar__crest">
          <BrandMark />
        </div>
        <div>
          <strong>Galaktik</strong>
          <p>Mission Control</p>
        </div>
      </Link>

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
            <span>
              <link.Icon />
            </span>
            <b>{link.label}</b>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <p>Fleet readiness</p>
        <strong>{data.readiness}</strong>
        <small>
          {redAlert
            ? "Emergency confidence after cascading sector failures"
            : "Operational confidence across active sectors"}
        </small>
      </div>
    </aside>
  );
}
