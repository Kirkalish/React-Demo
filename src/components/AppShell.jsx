import React from "react";
import { Outlet } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import TopHeader from "./TopHeader";

export default function AppShell() {
  return (
    <div className="app-shell">
      <div className="app-shell__glow app-shell__glow--left" />
      <div className="app-shell__glow app-shell__glow--right" />

      <SidebarNav />

      <div className="app-shell__content">
        <TopHeader />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
