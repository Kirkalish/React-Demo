import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import CrewPage from "./pages/CrewPage";
import DashboardPage from "./pages/DashboardPage";
import MissionDetailPage from "./pages/MissionDetailPage";
import MissionsPage from "./pages/MissionsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="missions" element={<MissionsPage />} />
        <Route path="missions/:missionId" element={<MissionDetailPage />} />
        <Route path="crew" element={<CrewPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
