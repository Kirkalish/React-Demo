import React, { useEffect, useMemo, useState } from "react";
import { useAlertMode } from "../context/AlertModeContext";
import StatusBadge from "./StatusBadge";

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

function normalizeEfficiency(value) {
  const trimmed = value.trim();
  return trimmed.endsWith("%") ? trimmed : `${trimmed}%`;
}

function createBlankCrewMember(missions) {
  return {
    name: "",
    role: "",
    level: "5",
    status: "On deck",
    specialty: "",
    missionId: missions[0]?.id ?? "",
    efficiency: "90%",
  };
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
  const [selectedId, setSelectedId] = useState("");
  const [editForm, setEditForm] = useState(() => createBlankCrewMember(missions));

  const sortedCrew = useMemo(
    () => [...crewDataset].sort((left, right) => left.name.localeCompare(right.name)),
    [crewDataset],
  );

  useEffect(() => {
    setCreateForm(createBlankCrewMember(missions));
  }, [missions]);

  useEffect(() => {
    if (!sortedCrew.length) {
      setSelectedId("");
      setEditForm(createBlankCrewMember(missions));
      return;
    }

    const nextSelectedId = sortedCrew.some((member) => member.id === selectedId)
      ? selectedId
      : sortedCrew[0].id;

    setSelectedId(nextSelectedId);
  }, [missions, selectedId, sortedCrew]);

  useEffect(() => {
    const selectedMember = sortedCrew.find((member) => member.id === selectedId);

    if (!selectedMember) {
      return;
    }

    setEditForm({
      name: selectedMember.name,
      role: selectedMember.role,
      level: String(selectedMember.level),
      status: selectedMember.status,
      specialty: selectedMember.specialty,
      missionId: selectedMember.missionId,
      efficiency: selectedMember.efficiency,
    });
  }, [selectedId, sortedCrew]);

  if (!open) {
    return null;
  }

  const handleCreate = (event) => {
    event.preventDefault();

    if (!createForm.name.trim() || !createForm.role.trim() || !createForm.specialty.trim()) {
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
  };

  const handleUpdate = (event) => {
    event.preventDefault();

    if (!selectedId) {
      return;
    }

    upsertCrewMember({
      id: selectedId,
      name: editForm.name.trim(),
      role: editForm.role.trim(),
      level: Number(editForm.level),
      status: editForm.status,
      specialty: editForm.specialty.trim(),
      missionId: editForm.missionId,
      efficiency: normalizeEfficiency(editForm.efficiency),
    });
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

        <div className="crew-modal__grid">
          <section className="crew-modal__section">
            <div className="crew-modal__section-heading">
              <h3>Create crew member</h3>
              <p>Add a new explorer record to the current roster dataset.</p>
            </div>

            <form className="crew-form" onSubmit={handleCreate}>
              <label>
                Name
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </label>
              <label>
                Role
                <input
                  type="text"
                  value={createForm.role}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, role: event.target.value }))
                  }
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
                  value={createForm.specialty}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, specialty: event.target.value }))
                  }
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
              <button type="submit" className="crew-modal__button">
                Create crew member
              </button>
            </form>
          </section>

          <section className="crew-modal__section">
            <div className="crew-modal__section-heading">
              <h3>Update crew member</h3>
              <p>Edit a roster entry in the active dataset.</p>
            </div>

            <form className="crew-form" onSubmit={handleUpdate}>
              <label>
                Select crew member
                <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
                  {sortedCrew.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Name
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </label>
              <label>
                Role
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, role: event.target.value }))
                  }
                />
              </label>
              <label>
                Level
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={editForm.level}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, level: event.target.value }))
                  }
                />
              </label>
              <label>
                Status
                <input
                  type="text"
                  value={editForm.status}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, status: event.target.value }))
                  }
                />
              </label>
              <label>
                Specialty
                <input
                  type="text"
                  value={editForm.specialty}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, specialty: event.target.value }))
                  }
                />
              </label>
              <label>
                Mission
                <select
                  value={editForm.missionId}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, missionId: event.target.value }))
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
                  value={editForm.efficiency}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, efficiency: event.target.value }))
                  }
                />
              </label>
              <button type="submit" className="crew-modal__button">
                Update crew member
              </button>
            </form>
          </section>
        </div>

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
