import React, { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useAlertMode } from "../context/AlertModeContext";
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
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const [shouldRender, setShouldRender] = React.useState(open);
  const {
    preferences: {
      accessibility: { reduceMotion },
    },
  } = useAlertMode();

  useEffect(() => {
    if (open) {
      setShouldRender(true);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [open]);

  useLayoutEffect(() => {
    if (!shouldRender || !panelRef.current || !backdropRef.current) {
      return;
    }

    if (reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([backdropRef.current, panelRef.current], { clearProps: "transform,opacity,visibility" });
      if (!open) {
        setShouldRender(false);
      }
      return;
    }

    let timeline;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const header = panel.querySelector(".settings-modal__header");
    const sections = panel.querySelectorAll(".settings-modal__section");

    if (open) {
      gsap.set(backdrop, { autoAlpha: 0 });
      gsap.set(panel, { autoAlpha: 0, y: 18, scale: 0.985, transformOrigin: "center center" });
      if (header) {
        gsap.set(header, { autoAlpha: 0, y: 10 });
      }
      if (sections.length) {
        gsap.set(sections, { autoAlpha: 0, y: 14 });
      }

      timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.to(backdrop, { autoAlpha: 1, duration: 0.18 }, 0);
      timeline.to(
        panel,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.24,
        },
        0,
      );

      if (header) {
        timeline.to(
          header,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.18,
          },
          "-=0.12",
        );
      }

      if (sections.length) {
        timeline.to(
          sections,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.22,
            stagger: 0.045,
            clearProps: "transform,opacity,visibility",
          },
          "-=0.08",
        );
      }
    } else {
      timeline = gsap.timeline({
        defaults: {
          ease: "power2.inOut",
        },
        onComplete: () => {
          setShouldRender(false);
        },
      });

      timeline.to(sections, { autoAlpha: 0, y: 8, duration: 0.12, stagger: 0.025 }, 0);
      if (header) {
        timeline.to(header, { autoAlpha: 0, y: 8, duration: 0.12 }, 0.03);
      }
      timeline.to(
        panel,
        {
          autoAlpha: 0,
          y: 12,
          scale: 0.985,
          duration: 0.18,
        },
        0.02,
      );
      timeline.to(backdrop, { autoAlpha: 0, duration: 0.18 }, 0);
    }

    return () => {
      timeline.kill();
      gsap.set([backdrop, panel], { clearProps: "transform,opacity,visibility" });
      if (header) {
        gsap.set(header, { clearProps: "transform,opacity,visibility" });
      }
      if (sections.length) {
        gsap.set(sections, { clearProps: "transform,opacity,visibility" });
      }
    };
  }, [open, reduceMotion]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-modal-title">
      <div ref={backdropRef} className="settings-modal__backdrop" onClick={onClose} />
      <div ref={panelRef} className="settings-modal__panel">
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
