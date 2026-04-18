import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AlertModeProvider, useAlertMode } from "../context/AlertModeContext";
import SidebarNav from "./SidebarNav";
import TopHeader from "./TopHeader";

function ShellLayout() {
  const { redAlert } = useAlertMode();

  useEffect(() => {
    document.body.classList.toggle("body--alert", redAlert);

    return () => {
      document.body.classList.remove("body--alert");
    };
  }, [redAlert]);

  return (
    <div className={redAlert ? "app-shell app-shell--alert" : "app-shell"}>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="app-shell__glow app-shell__glow--left" />
      <div className="app-shell__glow app-shell__glow--right" />

      <SidebarNav />

      <div className="app-shell__content">
        <TopHeader />
        <main id="main-content" className="app-main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AppShell() {
  return (
    <AlertModeProvider>
      <ShellLayout />
    </AlertModeProvider>
  );
}
