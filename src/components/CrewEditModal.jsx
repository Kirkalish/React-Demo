import React, { useEffect, useState } from "react";
import { useAlertMode } from "../context/AlertModeContext";
import {
  formatRequiredFieldMessage,
  normalizeEfficiency,
  validateCrewForm,
} from "./crewFormUtils";

export default function CrewEditModal({ member, open, onClose }) {
  const {
    data: { missions },
    upsertCrewMember,
  } = useAlertMode();
  const [form, setForm] = useState({
    name: "",
    role: "",
    level: "5",
    status: "",
    specialty: "",
    missionId: "",
    efficiency: "90%",
  });
  const [error, setError] = useState("");
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    if (!member) {
      return;
    }

    setForm({
      name: member.name,
      role: member.role,
      level: String(member.level),
      status: member.status,
      specialty: member.specialty,
      missionId: member.missionId,
      efficiency: member.efficiency,
    });
    setError("");
    setMissingFields([]);
  }, [member]);

  if (!open || !member) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextMissingFields = validateCrewForm(form);

    if (nextMissingFields.length) {
      setMissingFields(nextMissingFields);
      setError(formatRequiredFieldMessage(nextMissingFields));
      return;
    }

    upsertCrewMember({
      id: member.id,
      name: form.name.trim(),
      role: form.role.trim(),
      level: Number(form.level),
      status: form.status,
      specialty: form.specialty.trim(),
      missionId: form.missionId,
      efficiency: normalizeEfficiency(form.efficiency),
    });

    onClose();
  };

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
    setMissingFields((current) => current.filter((field) => field !== key));
  };

  return (
    <div className="crew-modal" role="dialog" aria-modal="true" aria-labelledby="crew-edit-title">
      <div className="crew-modal__backdrop" onClick={onClose} />
      <div className="crew-modal__panel crew-modal__panel--narrow">
        <div className="crew-modal__header">
          <div>
            <p className="eyebrow">Crew dossier controls</p>
            <h2 id="crew-edit-title">Update crew member</h2>
          </div>
          <button type="button" className="crew-modal__close" onClick={onClose} aria-label="Close crew editor">
            Close
          </button>
        </div>

        <form className="crew-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              aria-invalid={missingFields.includes("name")}
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </label>
          <label>
            Role
            <input
              type="text"
              aria-invalid={missingFields.includes("role")}
              value={form.role}
              onChange={(event) => updateField("role", event.target.value)}
            />
          </label>
          <label>
            Level
            <input
              type="number"
              min="1"
              max="12"
              value={form.level}
              onChange={(event) => updateField("level", event.target.value)}
            />
          </label>
          <label>
            Status
            <input
              type="text"
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
            />
          </label>
          <label>
            Specialty
            <input
              type="text"
              aria-invalid={missingFields.includes("specialty")}
              value={form.specialty}
              onChange={(event) => updateField("specialty", event.target.value)}
            />
          </label>
          <label>
            Mission
            <select
              value={form.missionId}
              onChange={(event) => updateField("missionId", event.target.value)}
            >
              {missions.map((mission) => (
                <option key={mission.id} value={mission.id}>
                  {mission.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Efficiency
            <input
              type="text"
              value={form.efficiency}
              onChange={(event) => updateField("efficiency", event.target.value)}
            />
          </label>
          {error ? (
            <p className="crew-form__feedback" role="alert" aria-live="assertive">
              {error}
            </p>
          ) : null}
          <button type="submit" className="crew-modal__button">
            Save crew changes
          </button>
        </form>
      </div>
    </div>
  );
}
