import React, { useEffect, useRef } from "react";
import { alertThemeOptions, nominalThemeOptions } from "../theme/themePresets";

function ThemeOptionGroup({ label, options, value, onChange }) {
  return (
    <div className="settings-modal__group">
      <div className="settings-modal__section-heading">
        <h3>{label}</h3>
      </div>
      <div className="settings-modal__theme-grid">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={
              option.value === value
                ? "settings-modal__theme-option settings-modal__theme-option--active"
                : "settings-modal__theme-option"
            }
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SettingsModal({
  open,
  onClose,
  preferences,
  onSetAccessibilityPreference,
  onSetThemePreference,
  onResetPreferences,
  onClearLocalState,
}) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-modal-title">
      <div className="settings-modal__backdrop" onClick={onClose} />
      <div className="settings-modal__panel">
        <div className="settings-modal__header">
          <div>
            <p className="eyebrow">System settings</p>
            <h2 id="settings-modal-title">Mission control preferences</h2>
            <p className="panel__lede">
              Configure saved accessibility options, palette presets, and local app state.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="crew-modal__close"
            onClick={onClose}
            aria-label="Close settings"
          >
            Close
          </button>
        </div>

        <div className="settings-modal__layout">
          <section className="settings-modal__section">
            <div className="settings-modal__section-heading">
              <h3>Accessibility preferences</h3>
              <p>These preferences are saved locally for future sessions.</p>
            </div>

            <button
              type="button"
              className={
                preferences.accessibility.reduceMotion
                  ? "settings-modal__toggle settings-modal__toggle--active"
                  : "settings-modal__toggle"
              }
              aria-pressed={preferences.accessibility.reduceMotion}
              onClick={() =>
                onSetAccessibilityPreference(
                  "reduceMotion",
                  !preferences.accessibility.reduceMotion,
                )
              }
            >
              <strong>Reduce motion</strong>
              <small>Disable deck animation flourishes and route transitions.</small>
            </button>

            <button
              type="button"
              className={
                preferences.accessibility.enhancedContrast
                  ? "settings-modal__toggle settings-modal__toggle--active"
                  : "settings-modal__toggle"
              }
              aria-pressed={preferences.accessibility.enhancedContrast}
              onClick={() =>
                onSetAccessibilityPreference(
                  "enhancedContrast",
                  !preferences.accessibility.enhancedContrast,
                )
              }
            >
              <strong>Enhanced contrast</strong>
              <small>Increase panel separation, text contrast, and focus visibility.</small>
            </button>

            <button
              type="button"
              className="crew-modal__button crew-modal__button--secondary"
              onClick={onResetPreferences}
            >
              Reset preferences
            </button>
          </section>

          <section className="settings-modal__section">
            <div className="settings-modal__section-heading">
              <h3>Theme presets</h3>
              <p>Choose separate accent palettes for nominal and red alert modes.</p>
            </div>

            <ThemeOptionGroup
              label="Nominal mode"
              options={nominalThemeOptions}
              value={preferences.themes.nominal}
              onChange={(value) => onSetThemePreference("nominal", value)}
            />

            <ThemeOptionGroup
              label="Alert mode"
              options={alertThemeOptions}
              value={preferences.themes.alert}
              onChange={(value) => onSetThemePreference("alert", value)}
            />
          </section>
        </div>

        <section className="settings-modal__section settings-modal__section--danger">
          <div className="settings-modal__section-heading">
            <h3>Local state data</h3>
            <p>Clear saved deck state, overlay state, preferences, and crew dataset changes.</p>
          </div>

          <button
            type="button"
            className="crew-modal__button settings-modal__danger"
            onClick={onClearLocalState}
          >
            Clear local state data
          </button>
        </section>
      </div>
    </div>
  );
}
