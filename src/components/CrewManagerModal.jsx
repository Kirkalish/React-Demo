import React, { useEffect, useMemo, useState } from "react";
import { useAlertMode } from "../context/AlertModeContext";
import StatusBadge from "./StatusBadge";
import {
  createBlankCrewMember,
  formatRequiredFieldMessage,
  normalizeEfficiency,
  validateCrewForm,
} from "./crewFormUtils";

function buildMemberId(name, existingMembers) {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "new-crew";

  let candidate = base;
  let suffix = 2;

  while (existingMembers.some((member) => member.id === candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export default function CrewManagerModal({ open, onClose }) {
  const {
    redAlert,
    data: { missions },
    crewDataset,
    upsertCrewMember,
    setCrewMemberHidden,
    resetCrewDataset,
  } = useAlertMode();
  const [createForm, setCreateForm] = useState(() => createBlankCrewMember(missions));
  const [createError, setCreateError] = useState("");
  const [createMissingFields, setCreateMissingFields] = useState([]);

  const sortedCrew = useMemo(
    () => [...crewDataset].sort((left, right) => left.name.localeCompare(right.name)),
    [crewDataset],
  );

  useEffect(() => {
    setCreateForm(createBlankCrewMember(missions));
    setCreateError("");
    setCreateMissingFields([]);
  }, [missions]);

  if (!open) {
    return null;
  }

  const handleCreate = (event) => {
    event.preventDefault();

    const missingFields = validateCrewForm(createForm);

    if (missingFields.length) {
      setCreateMissingFields(missingFields);
      setCreateError(formatRequiredFieldMessage(missingFields));
      return;
    }

    upsertCrewMember({
      id: buildMemberId(createForm.name, crewDataset),
      name: createForm.name.trim(),
      role: createForm.role.trim(),
      level: Number(createForm.level),
      status: createForm.status,
      specialty: createForm.specialty.trim(),
      missionId: createForm.missionId,
      efficiency: normalizeEfficiency(createForm.efficiency),
      hidden: false,
    });

    setCreateForm(createBlankCrewMember(missions));
    setCreateError("");
    setCreateMissingFields([]);
  };

  return (
    <div className="crew-modal" role="dialog" aria-modal="true" aria-labelledby="crew-modal-title">
      <div className="crew-modal__backdrop" onClick={onClose} />
      <div className="crew-modal__panel">
        <div className="crew-modal__header">
          <div>
            <p className="eyebrow">{redAlert ? "Red alert crew dataset" : "Crew dataset controls"}</p>
            <h2 id="crew-modal-title">Manage explorer roster</h2>
          </div>
          <button type="button" className="crew-modal__close" onClick={onClose} aria-label="Close crew controls">
            Close
          </button>
        </div>

        <section className="crew-modal__section crew-modal__section--full">
          <div className="crew-modal__section-heading">
            <h3>Create crew member</h3>
            <p>Add a new explorer record to the current roster dataset.</p>
          </div>

          <form className="crew-form" onSubmit={handleCreate}>
            <label>
              Name
              <input
                type="text"
                aria-invalid={createMissingFields.includes("name")}
                value={createForm.name}
                onChange={(event) => {
                  setCreateForm((current) => ({ ...current, name: event.target.value }));
                  setCreateError("");
                  setCreateMissingFields((current) => current.filter((field) => field !== "name"));
                }}
              />
            </label>
            <label>
              Role
              <input
                type="text"
                aria-invalid={createMissingFields.includes("role")}
                value={createForm.role}
                onChange={(event) => {
                  setCreateForm((current) => ({ ...current, role: event.target.value }));
                  setCreateError("");
                  setCreateMissingFields((current) => current.filter((field) => field !== "role"));
                }}
              />
            </label>
            <label>
              Level
              <input
                type="number"
                min="1"
                max="12"
                value={createForm.level}
                onChange={(event) =>
                  setCreateForm((current) => ({ ...current, level: event.target.value }))
                }
              />
            </label>
            <label>
              Status
              <input
                type="text"
                value={createForm.status}
                onChange={(event) =>
                  setCreateForm((current) => ({ ...current, status: event.target.value }))
                }
              />
            </label>
            <label>
              Specialty
              <input
                type="text"
                aria-invalid={createMissingFields.includes("specialty")}
                value={createForm.specialty}
                onChange={(event) => {
                  setCreateForm((current) => ({ ...current, specialty: event.target.value }));
                  setCreateError("");
                  setCreateMissingFields((current) => current.filter((field) => field !== "specialty"));
                }}
              />
            </label>
            <label>
              Mission
              <select
                value={createForm.missionId}
                onChange={(event) =>
                  setCreateForm((current) => ({ ...current, missionId: event.target.value }))
                }
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
                value={createForm.efficiency}
                onChange={(event) =>
                  setCreateForm((current) => ({ ...current, efficiency: event.target.value }))
                }
              />
            </label>
            {createError ? (
              <p className="crew-form__feedback" role="alert" aria-live="assertive">
                {createError}
              </p>
            ) : null}
            <button type="submit" className="crew-modal__button">
              Create crew member
            </button>
          </form>
        </section>

        <section className="crew-modal__section crew-modal__section--full">
          <div className="crew-modal__section-heading">
            <h3>Hide or restore crew members</h3>
            <p>Remove entries from the roster view without deleting them from the dataset.</p>
          </div>

          <div className="crew-modal__list">
            {sortedCrew.map((member) => (
              <article key={member.id} className="crew-modal__list-item">
                <div>
                  <strong>{member.name}</strong>
                  <p>
                    {member.role}
                    {" · "}
                    {member.hidden ? "Hidden" : "Visible"}
                  </p>
                </div>
                <div className="crew-modal__list-actions">
                  <StatusBadge label={member.status} />
                  <button
                    type="button"
                    className="crew-modal__button crew-modal__button--secondary"
                    onClick={() => setCrewMemberHidden(member.id, !member.hidden)}
                  >
                    {member.hidden ? "Restore" : "Hide"}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <button type="button" className="crew-modal__button crew-modal__button--reset" onClick={resetCrewDataset}>
            Reset crew dataset
          </button>
        </section>
      </div>
    </div>
  );
}
