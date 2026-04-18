import React, { useEffect, useState } from "react";
import { useAlertMode } from "../context/AlertModeContext";
import {
  createBlankMission,
  formatMissionRequiredFieldMessage,
  parseMissionObjectives,
  serializeMissionObjectives,
  validateMissionForm,
} from "./missionFormUtils";

export default function MissionEditModal({ mission, open, onClose }) {
  const { upsertMission } = useAlertMode();
  const [form, setForm] = useState(() => createBlankMission());
  const [error, setError] = useState("");
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    if (!mission) {
      return;
    }

    setForm({
      name: mission.name,
      status: mission.status,
      priority: mission.priority,
      category: mission.category,
      region: mission.region,
      summary: mission.summary,
      reward: mission.reward,
      startedAt: mission.startedAt,
      difficulty: mission.difficulty,
      objectives: serializeMissionObjectives(mission.objectives),
      fuel: mission.resourceCost.fuel,
      cores: mission.resourceCost.cores,
      med: mission.resourceCost.med,
    });
    setError("");
    setMissingFields([]);
  }, [mission]);

  if (!open || !mission) {
    return null;
  }

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
    setMissingFields((current) => current.filter((field) => field !== key));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextMissingFields = validateMissionForm(form);

    if (nextMissingFields.length) {
      setMissingFields(nextMissingFields);
      setError(formatMissionRequiredFieldMessage(nextMissingFields));
      return;
    }

    upsertMission({
      ...mission,
      name: form.name.trim(),
      status: form.status,
      priority: form.priority,
      category: form.category.trim(),
      region: form.region.trim(),
      summary: form.summary.trim(),
      reward: form.reward.trim(),
      startedAt: form.startedAt.trim(),
      difficulty: form.difficulty.trim(),
      objectives: parseMissionObjectives(form.objectives),
      resourceCost: {
        fuel: form.fuel.trim(),
        cores: form.cores.trim(),
        med: form.med.trim(),
      },
    });

    onClose();
  };

  return (
    <div className="crew-modal" role="dialog" aria-modal="true" aria-labelledby="mission-edit-title">
      <div className="crew-modal__backdrop" onClick={onClose} />
      <div className="crew-modal__panel crew-modal__panel--narrow">
        <div className="crew-modal__header">
          <div>
            <p className="eyebrow">Mission dossier controls</p>
            <h2 id="mission-edit-title">Update mission</h2>
          </div>
          <button type="button" className="crew-modal__close" onClick={onClose} aria-label="Close mission editor">
            Close
          </button>
        </div>

        <form className="crew-form mission-form" onSubmit={handleSubmit}>
          <label>
            Mission name
            <input
              type="text"
              aria-invalid={missingFields.includes("name")}
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </label>
          <label>
            Category
            <input
              type="text"
              aria-invalid={missingFields.includes("category")}
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
            />
          </label>
          <label>
            Status
            <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
              <option>Planning</option>
              <option>Standby</option>
              <option>Active</option>
              <option>Alert</option>
              <option>Complete</option>
            </select>
          </label>
          <label>
            Priority
            <select value={form.priority} onChange={(event) => updateField("priority", event.target.value)}>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
            </select>
          </label>
          <label>
            Region
            <input
              type="text"
              aria-invalid={missingFields.includes("region")}
              value={form.region}
              onChange={(event) => updateField("region", event.target.value)}
            />
          </label>
          <label>
            Reward
            <input
              type="text"
              aria-invalid={missingFields.includes("reward")}
              value={form.reward}
              onChange={(event) => updateField("reward", event.target.value)}
            />
          </label>
          <label>
            Opened
            <input
              type="text"
              aria-invalid={missingFields.includes("startedAt")}
              value={form.startedAt}
              onChange={(event) => updateField("startedAt", event.target.value)}
            />
          </label>
          <label>
            Difficulty
            <input
              type="text"
              aria-invalid={missingFields.includes("difficulty")}
              value={form.difficulty}
              onChange={(event) => updateField("difficulty", event.target.value)}
            />
          </label>
          <label className="mission-form__span-two">
            Summary
            <textarea
              rows="4"
              aria-invalid={missingFields.includes("summary")}
              value={form.summary}
              onChange={(event) => updateField("summary", event.target.value)}
            />
          </label>
          <label className="mission-form__span-two">
            Objectives
            <textarea
              rows="5"
              aria-invalid={missingFields.includes("objectives")}
              value={form.objectives}
              onChange={(event) => updateField("objectives", event.target.value)}
            />
          </label>
          <label>
            Fuel allocation
            <input
              type="text"
              aria-invalid={missingFields.includes("fuel")}
              value={form.fuel}
              onChange={(event) => updateField("fuel", event.target.value)}
            />
          </label>
          <label>
            Quantum core use
            <input
              type="text"
              aria-invalid={missingFields.includes("cores")}
              value={form.cores}
              onChange={(event) => updateField("cores", event.target.value)}
            />
          </label>
          <label className="mission-form__span-two">
            Medical reserve
            <input
              type="text"
              aria-invalid={missingFields.includes("med")}
              value={form.med}
              onChange={(event) => updateField("med", event.target.value)}
            />
          </label>
          {error ? (
            <p className="crew-form__feedback" role="alert" aria-live="assertive">
              {error}
            </p>
          ) : null}
          <button type="submit" className="crew-modal__button">
            Save mission changes
          </button>
        </form>
      </div>
    </div>
  );
}
