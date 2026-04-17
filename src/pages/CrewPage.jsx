import React from "react";
import CrewCard from "../components/CrewCard";
import { useAlertMode } from "../context/AlertModeContext";

export default function CrewPage() {
  const {
    data: { crew },
  } = useAlertMode();

  return (
    <div className="stack-layout">
      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Crew operations</p>
            <h2>Explorer roster</h2>
          </div>
        </div>

        <p className="panel__lede">
          A supporting roster view rounds out the product demo with reusable cards, status
          states, and relationship data between explorers and missions.
        </p>
      </section>

      <section className="crew-grid">
        {crew.map((member) => (
          <CrewCard key={member.id} member={member} />
        ))}
      </section>
    </div>
  );
}
