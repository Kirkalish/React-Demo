const STORAGE_KEY = "galaktik:mission-control-state";

export function readAppState() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function updateStoredAppState(patch) {
  if (typeof window === "undefined") {
    return;
  }

  const current = readAppState();

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
  } catch {
    // Ignore storage write failures and continue with in-memory state.
  }
}

export function clearStoredAppState() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage removal failures and continue with in-memory state.
  }
}
