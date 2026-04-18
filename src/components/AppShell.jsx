import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { AlertModeProvider, useAlertMode } from "../context/AlertModeContext";
import SidebarNav from "./SidebarNav";
import TopHeader from "./TopHeader";

function MissionControlMark() {
  return (
    <svg
      viewBox="0 0 96 96"
      aria-hidden="true"
      className="launch-overlay__mark"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="48" cy="48" r="22" />
      <circle cx="48" cy="48" r="8" />
      <path d="M14 48h16" />
      <path d="M66 48h16" />
      <path d="M48 14v16" />
      <path d="M48 66v16" />
      <path d="M68.5 27.5 79 17" />
      <path d="M27.5 27.5 17 17" />
      <path d="M27.5 68.5 17 79" />
      <path d="M68.5 68.5 79 79" />
      <path d="M48 26c-6 6-9 14-9 22s3 16 9 22" />
      <path d="M48 26c6 6 9 14 9 22s-3 16-9 22" />
    </svg>
  );
}

function ControlDeckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="control-dock__icon">
      <rect x="4.5" y="4.5" width="5" height="5" rx="1.4" />
      <rect x="14.5" y="4.5" width="5" height="5" rx="1.4" />
      <rect x="4.5" y="14.5" width="5" height="5" rx="1.4" />
      <rect x="14.5" y="14.5" width="5" height="5" rx="1.4" />
    </svg>
  );
}

function ShellLayout() {
  const { redAlert, setRedAlert } = useAlertMode();
  const navigate = useNavigate();
  const location = useLocation();
  const overlayRef = useRef(null);
  const overlayButtonRef = useRef(null);
  const menuRef = useRef(null);
  const contentStageRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("body--alert", redAlert);

    return () => {
      document.body.classList.remove("body--alert");
    };
  }, [redAlert]);

  useEffect(() => {
    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = documentElement.style.overflow;
    const shouldLockScroll = !isRevealed;

    if (shouldLockScroll) {
      body.style.overflow = "hidden";
      documentElement.style.overflow = "hidden";
    } else {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousHtmlOverflow;
    }

    return () => {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isRevealed]);

  useEffect(() => {
    if (!isRevealed && !isAnimating) {
      overlayButtonRef.current?.focus();
    }
  }, [isAnimating, isRevealed]);

  useLayoutEffect(() => {
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { yPercent: 0, autoAlpha: 1 });
    }

    if (menuRef.current) {
      gsap.set(menuRef.current, { autoAlpha: 0, y: 20, scale: 0.97, display: "none" });
    }
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useLayoutEffect(() => {
    if (!contentStageRef.current || !isRevealed) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const stage = contentStageRef.current;
    const targets = stage.querySelectorAll(
      ".top-header, .panel, .crew-card, .mission-table__row, .status-chip",
    );

    const timeline = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    timeline.fromTo(
      stage,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        duration: 0.18,
      },
    );

    timeline.fromTo(
      targets,
      {
        autoAlpha: 0,
        y: 18,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.42,
        stagger: 0.045,
        clearProps: "transform,opacity,visibility",
      },
      0,
    );

    return () => {
      timeline.kill();
      gsap.set(stage, { clearProps: "opacity,visibility" });
      gsap.set(targets, { clearProps: "transform,opacity,visibility" });
    };
  }, [location.pathname, isRevealed]);

  useEffect(() => {
    if (!menuRef.current) {
      return;
    }

    const menu = menuRef.current;
    const actions = menu.querySelectorAll(".control-dock__action");

    if (menuOpen && isRevealed) {
      gsap.set(menu, { display: "grid" });
      const timeline = gsap.timeline();
      timeline.to(menu, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.28,
        ease: "power3.out",
      });
      timeline.fromTo(
        actions,
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.24,
          stagger: 0.04,
          ease: "power2.out",
        },
        "<0.02",
      );

      return () => {
        timeline.kill();
      };
    }

    const tween = gsap.to(menu, {
      autoAlpha: 0,
      y: 20,
      scale: 0.97,
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(menu, { display: "none" });
      },
    });

    return () => {
      tween.kill();
    };
  }, [menuOpen, isRevealed]);

  const revealMissionControl = () => {
    if (!overlayRef.current || isAnimating || isRevealed) {
      return;
    }

    setIsAnimating(true);
    gsap.to(overlayRef.current, {
      yPercent: -100,
      autoAlpha: 0,
      duration: 1.05,
      ease: "power4.inOut",
      onStart: () => {
        setIsRevealed(true);
      },
      onComplete: () => {
        setIsAnimating(false);
      },
    });
  };

  const returnToOverlay = () => {
    if (!overlayRef.current || isAnimating) {
      return;
    }

    setIsAnimating(true);
    setMenuOpen(false);
    setRedAlert(false);
    navigate("/");
    gsap.set(overlayRef.current, { autoAlpha: 1, yPercent: -100, display: "block" });
    setIsRevealed(false);
    gsap.to(overlayRef.current, {
      yPercent: 0,
      duration: 0.9,
      ease: "power4.inOut",
      onComplete: () => {
        setIsAnimating(false);
      },
    });
  };

  return (
    <div className={redAlert ? "app-shell app-shell--alert" : "app-shell"}>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="app-shell__glow app-shell__glow--left" />
      <div className="app-shell__glow app-shell__glow--right" />

      <SidebarNav aria-hidden={!isRevealed} inert={!isRevealed ? true : undefined} />

      <div
        className="app-shell__content"
        aria-hidden={!isRevealed}
        inert={!isRevealed ? true : undefined}
      >
        <TopHeader />
        <main id="main-content" className="app-main" tabIndex={-1}>
          <div key={location.pathname} ref={contentStageRef} className="route-stage">
            <Outlet />
          </div>
        </main>
      </div>

      <div
        ref={overlayRef}
        className="launch-overlay"
        role="dialog"
        aria-modal={!isRevealed}
        aria-labelledby="launch-overlay-title"
        aria-describedby="launch-overlay-description"
        aria-hidden={isRevealed}
      >
        <div className="launch-overlay__panel">
          <MissionControlMark />
          <p className="eyebrow">Mission access</p>
          <h2 id="launch-overlay-title">Galaktik Mission Control</h2>
          <p id="launch-overlay-description" className="launch-overlay__copy">
            Engage the operations deck to access mission telemetry, explorer dossiers, and live
            sector controls.
          </p>
          <button
            ref={overlayButtonRef}
            type="button"
            className="launch-overlay__button"
            onClick={revealMissionControl}
            disabled={isAnimating}
          >
            Enter mission control
          </button>
        </div>
      </div>

      {isRevealed ? (
        <div className="control-dock" aria-label="Mission control quick actions">
          <div ref={menuRef} id="control-dock-panel" className="control-dock__panel">
            <button
              type="button"
              className="control-dock__action control-dock__action--alert"
              aria-pressed={redAlert}
              onClick={() => {
                setRedAlert((current) => !current);
                setMenuOpen(false);
              }}
            >
              <span className="control-dock__kicker">Alert state</span>
              <strong>{redAlert ? "Disable red alert" : "Enable red alert"}</strong>
              <small>{redAlert ? "Return the system to nominal thresholds." : "Shift the deck into failure mode."}</small>
            </button>

            <button
              type="button"
              className="control-dock__action"
              onClick={() => {
                navigate("/missions");
                setMenuOpen(false);
              }}
            >
              <span className="control-dock__kicker">Registry</span>
              <strong>Open missions</strong>
              <small>Jump directly into active mission filters and detail views.</small>
            </button>

            <button
              type="button"
              className="control-dock__action"
              onClick={() => {
                navigate("/crew");
                setMenuOpen(false);
              }}
            >
              <span className="control-dock__kicker">Roster</span>
              <strong>Open crew</strong>
              <small>Review explorer dossiers, assignments, and readiness.</small>
            </button>

            <button
              type="button"
              className="control-dock__action control-dock__action--logout"
              onClick={returnToOverlay}
            >
              <span className="control-dock__kicker">Session</span>
              <strong>Log off</strong>
              <small>Return to the launch overlay and reset the alert state.</small>
            </button>
          </div>

          <button
            type="button"
            className={menuOpen ? "control-dock__toggle control-dock__toggle--active" : "control-dock__toggle"}
            aria-expanded={menuOpen}
            aria-controls="control-dock-panel"
            aria-label="Open mission control deck"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <ControlDeckIcon />
            <span className="control-dock__toggle-label">Control deck</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function AppShell() {
  return (
    <AlertModeProvider>
      <ShellLayout />
    </AlertModeProvider>
  );
}
