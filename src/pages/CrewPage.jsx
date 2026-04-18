import React, { useState } from "react";
import CrewManagerModal from "../components/CrewManagerModal";
import CrewCard from "../components/CrewCard";
import { useAlertMode } from "../context/AlertModeContext";

function CrewControlsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="crew-controls__icon">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.2" />
      <path d="M12 18.3v2.2" />
      <path d="M3.5 12h2.2" />
      <path d="M18.3 12h2.2" />
      <path d="M6 6l1.6 1.6" />
      <path d="M16.4 16.4 18 18" />
      <path d="M6 18l1.6-1.6" />
      <path d="M16.4 7.6 18 6" />
    </svg>
  );
}

export default function CrewPage() {
  const {
    data: { crew },
  } = useAlertMode();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="stack-layout">
      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Crew operations</p>
            <h2>Explorer roster</h2>
          </div>
          <button
            type="button"
            className="crew-controls__button"
            aria-label="Manage crew roster"
            onClick={() => setModalOpen(true)}
          >
            <CrewControlsIcon />
          </button>
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
      <CrewManagerModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
