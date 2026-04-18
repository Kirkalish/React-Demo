export function normalizeEfficiency(value) {
  const trimmed = value.trim();
  return trimmed.endsWith("%") ? trimmed : `${trimmed}%`;
}

export function createBlankCrewMember(missions) {
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

export function validateCrewForm(form) {
  const missingFields = [];

  if (!form.name.trim()) {
    missingFields.push("name");
  }

  if (!form.role.trim()) {
    missingFields.push("role");
  }

  if (!form.specialty.trim()) {
    missingFields.push("specialty");
  }

  return missingFields;
}

export function formatRequiredFieldMessage(missingFields) {
  if (!missingFields.length) {
    return "";
  }

  if (missingFields.length === 1) {
    return `Please enter a ${missingFields[0]} before saving this crew member.`;
  }

  if (missingFields.length === 2) {
    return `Please enter ${missingFields[0]} and ${missingFields[1]} before saving this crew member.`;
  }

  return `Please complete these required fields before saving: ${missingFields.slice(0, -1).join(", ")}, and ${missingFields.at(-1)}.`;
}
