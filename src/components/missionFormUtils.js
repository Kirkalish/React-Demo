const REQUIRED_FIELDS = [
  "name",
  "category",
  "region",
  "summary",
  "reward",
  "startedAt",
  "difficulty",
  "fuel",
  "cores",
  "med",
];

const FIELD_LABELS = {
  name: "name",
  category: "category",
  region: "region",
  summary: "summary",
  reward: "reward",
  startedAt: "opened time",
  difficulty: "difficulty",
  fuel: "fuel allocation",
  cores: "quantum core use",
  med: "medical reserve",
  objectives: "objectives",
};

export function createBlankMission() {
  return {
    name: "",
    status: "Planning",
    priority: "Medium",
    category: "",
    region: "",
    summary: "",
    reward: "",
    startedAt: "",
    difficulty: "",
    objectives: "",
    fuel: "",
    cores: "",
    med: "",
  };
}

export function parseMissionObjectives(value) {
  return value
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function serializeMissionObjectives(objectives) {
  return objectives.join("\n");
}

export function validateMissionForm(form) {
  const missing = REQUIRED_FIELDS.filter((field) => !String(form[field] ?? "").trim());

  if (parseMissionObjectives(form.objectives).length === 0) {
    missing.push("objectives");
  }

  return missing;
}

export function formatMissionRequiredFieldMessage(fields) {
  if (!fields.length) {
    return "";
  }

  const labels = fields.map((field) => FIELD_LABELS[field] ?? field);

  if (labels.length === 1) {
    return `Add a ${labels[0]} before saving the mission.`;
  }

  if (labels.length === 2) {
    return `Add ${labels[0]} and ${labels[1]} before saving the mission.`;
  }

  return `Add ${labels.slice(0, -1).join(", ")}, and ${labels.at(-1)} before saving the mission.`;
}
