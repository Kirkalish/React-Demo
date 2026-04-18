import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { AlertModeProvider, useAlertMode } from "../context/AlertModeContext";
import { readAppState, updateStoredAppState } from "../lib/localState";
import { getAlertThemeVars, getNominalThemeVars } from "../theme/themePresets";
import SidebarNav from "./SidebarNav";
import SearchPalette from "./SearchPalette";
import SettingsModal from "./SettingsModal";
import NotificationFeed from "./NotificationFeed";
import ToastStack from "./ToastStack";
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

function BackArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="control-dock__back-icon">
      <path d="M14.5 5.5 8 12l6.5 6.5" />
      <path d="M9 12h8.5" />
    </svg>
  );
}

function ShellLayout() {
  const {
    redAlert,
    setRedAlert,
    data,
    preferences,
    recentCommands,
    notificationFeed,
    toasts,
    dismissToast,
    clearToasts,
    clearNotificationFeed,
    registerCommand,
    executeSimulation,
    updateAccessibilityPreference,
    updateThemePreference,
    resetPreferences,
    resetAppState,
  } = useAlertMode();
  const navigate = useNavigate();
  const location = useLocation();
  const persistedState = useMemo(() => readAppState(), []);
  const overlayRef = useRef(null);
  const overlayButtonRef = useRef(null);
  const menuRef = useRef(null);
  const deckTrackRef = useRef(null);
  const contentStageRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(() => persistedState.isRevealed ?? false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deckView, setDeckView] = useState("main");
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState("Simulation deck standing by.");
  const [isAnimating, setIsAnimating] = useState(false);
  const reducedMotion =
    preferences.accessibility.reduceMotion ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    document.body.classList.toggle("body--alert", redAlert);
    document.body.classList.toggle("body--contrast", preferences.accessibility.enhancedContrast);

    return () => {
      document.body.classList.remove("body--alert");
      document.body.classList.remove("body--contrast");
    };
  }, [preferences.accessibility.enhancedContrast, redAlert]);

  useEffect(() => {
    updateStoredAppState({ isRevealed });
  }, [isRevealed]);

  useEffect(() => {
    const root = document.documentElement;
    const nominalVars = getNominalThemeVars(preferences.themes.nominal);
    const alertVars = getAlertThemeVars(preferences.themes.alert);

    Object.entries({ ...nominalVars, ...alertVars }).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [preferences.themes.alert, preferences.themes.nominal]);

  useEffect(() => {
    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = documentElement.style.overflow;
    const shouldLockScroll = !isRevealed || searchOpen || settingsOpen;

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
  }, [isRevealed, searchOpen, settingsOpen]);

  useEffect(() => {
    if (!isRevealed && !isAnimating) {
      overlayButtonRef.current?.focus();
    }
  }, [isAnimating, isRevealed]);

  useLayoutEffect(() => {
    if (overlayRef.current) {
      gsap.set(overlayRef.current, isRevealed ? { yPercent: -100, autoAlpha: 0 } : { yPercent: 0, autoAlpha: 1 });
    }

    if (menuRef.current) {
      gsap.set(menuRef.current, { autoAlpha: 0, y: 20, scale: 0.97, display: "none" });
    }

    if (deckTrackRef.current) {
      gsap.set(deckTrackRef.current, { xPercent: deckView === "main" ? 0 : -50 });
    }
  }, [isRevealed]);

  useEffect(() => {
    setMenuOpen(false);
    setDeckView("main");
    setSearchOpen(false);
    setSettingsOpen(false);
    setNotificationOpen(false);
  }, [location.pathname]);

  useLayoutEffect(() => {
    if (!contentStageRef.current || !isRevealed) {
      return;
    }

    if (reducedMotion) {
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
  }, [isRevealed, location.pathname, reducedMotion]);

  useEffect(() => {
    if (!menuRef.current) {
      return;
    }

    const menu = menuRef.current;
    const track = deckTrackRef.current;
    const actions = menu.querySelectorAll(
      `[data-page="${deckView}"] .control-dock__action, [data-page="${deckView}"] .control-dock__back`,
    );

    if (menuOpen && isRevealed) {
      gsap.set(menu, { display: "grid" });
      if (track) {
        gsap.set(track, { xPercent: deckView === "main" ? 0 : -50 });
      }
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
  }, [deckView, menuOpen, isRevealed]);

  useEffect(() => {
    if (!menuOpen || !deckTrackRef.current) {
      return;
    }

    const nextXPercent = deckView === "main" ? 0 : -50;

    if (reducedMotion) {
      gsap.set(deckTrackRef.current, { xPercent: nextXPercent });
      return;
    }

    const activePage = deckTrackRef.current.querySelector(`[data-page="${deckView}"]`);
    const animatedItems = activePage?.querySelectorAll(".control-dock__action, .control-dock__back");
    const timeline = gsap.timeline();

    timeline.to(deckTrackRef.current, {
      xPercent: nextXPercent,
      duration: 0.34,
      ease: "power3.inOut",
    });

    if (animatedItems?.length) {
      timeline.fromTo(
        animatedItems,
        {
          autoAlpha: 0,
          y: 12,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.2,
          stagger: 0.03,
          ease: "power2.out",
          clearProps: "transform,opacity,visibility",
        },
        "-=0.12",
      );
    }

    return () => {
      timeline.kill();
      if (animatedItems?.length) {
        gsap.set(animatedItems, { clearProps: "transform,opacity,visibility" });
      }
    };
  }, [deckView, menuOpen, reducedMotion]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const targetTag = event.target instanceof HTMLElement ? event.target.tagName : "";
      const isEditable =
        targetTag === "INPUT" ||
        targetTag === "TEXTAREA" ||
        targetTag === "SELECT" ||
        (event.target instanceof HTMLElement && event.target.isContentEditable);

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && isRevealed) {
        event.preventDefault();
        setSettingsOpen(false);
        setNotificationOpen(false);
        setSearchOpen(true);
        setMenuOpen(false);
        return;
      }

      if (event.key === "Escape") {
        if (searchOpen) {
          setSearchOpen(false);
          return;
        }

        if (settingsOpen) {
          setSettingsOpen(false);
          return;
        }

        if (notificationOpen) {
          setNotificationOpen(false);
          return;
        }

        if (menuOpen) {
          setMenuOpen(false);
        }
      }

      if (!isEditable && isRevealed && event.key === "/") {
        event.preventDefault();
        setSettingsOpen(false);
        setNotificationOpen(false);
        setSearchOpen(true);
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRevealed, menuOpen, notificationOpen, searchOpen, settingsOpen]);

  const revealMissionControl = () => {
    if (!overlayRef.current || isAnimating || isRevealed) {
      return;
    }

    if (reducedMotion) {
      gsap.set(overlayRef.current, { yPercent: -100, autoAlpha: 0 });
      setIsRevealed(true);
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

    if (reducedMotion) {
      setMenuOpen(false);
      setSearchOpen(false);
      setSettingsOpen(false);
      setNotificationOpen(false);
      setRedAlert(false);
      navigate("/");
      setIsRevealed(false);
      gsap.set(overlayRef.current, { autoAlpha: 1, yPercent: 0, display: "block" });
      return;
    }

    setIsAnimating(true);
    setMenuOpen(false);
    setSearchOpen(false);
    setSettingsOpen(false);
    setNotificationOpen(false);
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

  const openSettings = () => {
    setMenuOpen(false);
    setDeckView("main");
    setSearchOpen(false);
    setNotificationOpen(false);
    setSettingsOpen(true);
  };

  const openSearch = () => {
    setMenuOpen(false);
    setDeckView("main");
    setSettingsOpen(false);
    setNotificationOpen(false);
    setSearchOpen(true);
  };

  const handleClearLocalState = () => {
    resetAppState();
    setMenuOpen(false);
    setSearchOpen(false);
    setSettingsOpen(false);
    setNotificationOpen(false);
    navigate("/");
    setIsRevealed(false);
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { autoAlpha: 1, yPercent: 0, display: "block" });
    }
  };

  const simulationCommands = useMemo(
    () => [
      {
        id: "toggle-alert",
        kicker: "Alert state",
        label: redAlert ? "Disable red alert" : "Enable red alert",
        description: redAlert
          ? "Return the deck to nominal thresholds."
          : "Push the station into critical failure mode.",
        tone: "control-dock__action control-dock__action--alert",
        status: redAlert
          ? "Nominal thresholds restored across the deck."
          : "Red alert simulation engaged across all sectors.",
      },
      {
        id: "sector-lockdown",
        kicker: "Scenario",
        label: "Trigger sector lockdown",
        description: "Escalate mission traffic and route operators to the registry.",
        nextPath: "/missions",
        status: "Sector lockdown drill routed into the mission registry.",
      },
      {
        id: "readiness-drill",
        kicker: "Crew",
        label: "Run readiness drill",
        description: "Review explorer assignments and response posture under load.",
        nextPath: "/crew",
        status: "Crew readiness drill opened in the explorer roster.",
      },
      {
        id: "telemetry-sweep",
        kicker: "Diagnostics",
        label: "Broadcast telemetry sweep",
        description: "Open search commands to route a systems-wide response path.",
        openPalette: true,
        status: "Command palette opened for diagnostic sweep routing.",
      },
      {
        id: "comms-blackout",
        kicker: "Comms",
        label: "Stage comms blackout",
        description: "Simulate degraded telemetry and monitor dashboard readiness.",
        nextPath: "/",
        status: "Communications blackout staged on the mission dashboard.",
      },
      {
        id: "restore-nominal",
        kicker: "Recovery",
        label: "Restore nominal systems",
        description: "Reset drills, clear incident load, and return to baseline view.",
        nextPath: "/",
        tone: "control-dock__action control-dock__action--logout",
        status: "Simulation reset complete. Systems returned to nominal.",
      },
    ],
    [redAlert],
  );

  const handleSimulationAction = (command) => {
    executeSimulation(command.id);
    registerCommand({
      id: command.id,
      label: command.label,
      description: command.description,
      group: "Simulation",
    });

    if (command.status) {
      setSimulationStatus(command.status);
    }

    if (command.nextPath) {
      navigate(command.nextPath);
    }

    if (command.openPalette) {
      setMenuOpen(false);
      setDeckView("main");
      setSettingsOpen(false);
      setSearchOpen(true);
      return;
    }

    setMenuOpen(false);
    setDeckView("main");
  };

  const handleQuickNavigation = (command, path) => {
    registerCommand(command);
    navigate(path);
    setMenuOpen(false);
    setDeckView("main");
  };

  const toggleNotificationFeed = () => {
    setNotificationOpen((current) => {
      const nextOpen = !current;

      if (nextOpen) {
        clearToasts();
      }

      return nextOpen;
    });
  };

  const backgroundUiHidden = !isRevealed || searchOpen || settingsOpen;
  const appShellClassName = [
    "app-shell",
    redAlert ? "app-shell--alert" : null,
    preferences.accessibility.enhancedContrast ? "app-shell--contrast" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={appShellClassName}>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="app-shell__glow app-shell__glow--left" />
      <div className="app-shell__glow app-shell__glow--right" />

      <SidebarNav aria-hidden={backgroundUiHidden} inert={backgroundUiHidden ? true : undefined} />

      <div
        className="app-shell__content"
        aria-hidden={backgroundUiHidden}
        inert={backgroundUiHidden ? true : undefined}
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
        <div
          className="control-dock"
          aria-label="Mission control quick actions"
          aria-hidden={searchOpen || settingsOpen}
          inert={searchOpen || settingsOpen ? true : undefined}
        >
          <div ref={menuRef} id="control-dock-panel" className="control-dock__panel">
            <div className="control-dock__viewport">
              <div ref={deckTrackRef} className="control-dock__track">
                <section className="control-dock__page" data-page="main" aria-label="Control deck">
                  <div className="control-dock__page-header">
                    <div className="control-dock__page-copy">
                      <p className="control-dock__title">Control deck</p>
                      <h3>Mission controls</h3>
                      <small>Quick access to navigation, preferences, and operations tooling.</small>
                    </div>
                  </div>

                  <div className="control-dock__actions">
                    <button
                      type="button"
                      className="control-dock__action"
                      onClick={() => {
                        registerCommand({
                          id: "deck-simulation",
                          label: "Open simulation commands",
                          description: "Run alert drills, lock down sectors, and push scenario changes.",
                          group: "Control deck",
                        });
                        setDeckView("simulation");
                      }}
                    >
                      <span className="control-dock__kicker">Simulation</span>
                      <strong>Open simulation commands</strong>
                      <small>Run alert drills, lock down sectors, and push scenario changes.</small>
                    </button>

                    <button
                      type="button"
                      className="control-dock__action"
                      onClick={() => {
                        registerCommand({
                          id: "command-palette",
                          label: "Open command palette",
                          description: "Find routes, crew dossiers, missions, and quick actions.",
                          group: "Search",
                        });
                        openSearch();
                      }}
                    >
                      <span className="control-dock__kicker">Search</span>
                      <strong>Open command palette</strong>
                      <small>Find routes, crew dossiers, missions, and quick actions.</small>
                    </button>

                    <button
                      type="button"
                      className="control-dock__action"
                      onClick={() =>
                        handleQuickNavigation(
                          {
                            id: "route-missions",
                            label: "Open mission registry",
                            description: "Jump directly into mission filters and detail views.",
                            group: "Navigation",
                          },
                          "/missions",
                        )
                      }
                    >
                      <span className="control-dock__kicker">Registry</span>
                      <strong>Open missions</strong>
                      <small>Jump directly into active mission filters and detail views.</small>
                    </button>

                    <button
                      type="button"
                      className="control-dock__action"
                      onClick={() =>
                        handleQuickNavigation(
                          {
                            id: "route-crew",
                            label: "Open explorer roster",
                            description: "Review explorer dossiers, assignments, and readiness.",
                            group: "Navigation",
                          },
                          "/crew",
                        )
                      }
                    >
                      <span className="control-dock__kicker">Roster</span>
                      <strong>Open crew</strong>
                      <small>Review explorer dossiers, assignments, and readiness.</small>
                    </button>

                    <button
                      type="button"
                      className="control-dock__action"
                      onClick={() => {
                        registerCommand({
                          id: "action-settings",
                          label: "Open settings",
                          description: "Adjust themes, accessibility preferences, and saved state.",
                          group: "Actions",
                        });
                        openSettings();
                      }}
                    >
                      <span className="control-dock__kicker">Preferences</span>
                      <strong>Open settings</strong>
                      <small>Adjust themes, accessibility preferences, and saved state.</small>
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
                </section>

                <section
                  className="control-dock__page"
                  data-page="simulation"
                  aria-label="Simulation commands"
                >
                  <div className="control-dock__page-header">
                    <div className="control-dock__page-copy">
                      <p className="control-dock__title">Simulation panel</p>
                      <h3>Simulation commands</h3>
                      <small>{simulationStatus}</small>
                    </div>
                  </div>

                  <div className="control-dock__actions">
                    {simulationCommands.map((command) => (
                      <button
                        key={command.id}
                        type="button"
                        className={command.tone ?? "control-dock__action"}
                        aria-pressed={command.id === "toggle-alert" ? redAlert : undefined}
                        onClick={() => handleSimulationAction(command)}
                      >
                        <span className="control-dock__kicker">{command.kicker}</span>
                        <strong>{command.label}</strong>
                        <small>{command.description}</small>
                      </button>
                    ))}
                  </div>

                  <div className="control-dock__page-footer">
                    <button
                      type="button"
                      className="control-dock__back"
                      onClick={() => setDeckView("main")}
                    >
                      <BackArrowIcon />
                      <span>Back</span>
                    </button>
                  </div>
                </section>
              </div>
            </div>
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

      <SearchPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenSettings={openSettings}
        redAlert={redAlert}
        missions={data.missions}
        crew={data.crew}
        navigate={navigate}
        recentCommands={recentCommands}
        onRegisterCommand={registerCommand}
        onExecuteSimulation={executeSimulation}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        preferences={preferences}
        onSetAccessibilityPreference={updateAccessibilityPreference}
        onSetThemePreference={updateThemePreference}
        onResetPreferences={resetPreferences}
        onClearLocalState={handleClearLocalState}
      />

      {isRevealed ? (
        <NotificationFeed
          open={notificationOpen}
          onToggle={toggleNotificationFeed}
          notifications={notificationFeed}
          onClear={clearNotificationFeed}
        />
      ) : null}

      <ToastStack open={isRevealed} toasts={toasts} onDismiss={dismissToast} />
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
