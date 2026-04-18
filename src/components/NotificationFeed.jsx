import React, { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useAlertMode } from "../context/AlertModeContext";

function NotificationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="notification-feed__icon">
      <path d="M12 4.5a4.5 4.5 0 0 0-4.5 4.5v2.4c0 .8-.22 1.57-.64 2.26L5.8 15.4c-.37.59.05 1.35.75 1.35h10.9c.7 0 1.12-.76.75-1.35l-1.06-1.75a4.3 4.3 0 0 1-.64-2.26V9A4.5 4.5 0 0 0 12 4.5Z" />
      <path d="M9.7 18.4a2.55 2.55 0 0 0 4.6 0" />
    </svg>
  );
}

export default function NotificationFeed({ open, onToggle, notifications, onClear }) {
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

  useLayoutEffect(() => {
    if (!shouldRender || !panelRef.current) {
      return;
    }

    if (reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(panelRef.current, { clearProps: "transform,opacity,visibility" });
      if (!open) {
        setShouldRender(false);
      }
      return;
    }

    let timeline;
    const panel = panelRef.current;
    const header = panel.querySelector(".notification-feed__header");
    const items = panel.querySelectorAll(".notification-feed__item, .notification-feed__empty");

    if (open) {
      gsap.set(panel, { autoAlpha: 0, y: 14, scale: 0.98, transformOrigin: "bottom right" });
      if (header) {
        gsap.set(header, { autoAlpha: 0, y: 10 });
      }
      if (items.length) {
        gsap.set(items, { autoAlpha: 0, y: 12 });
      }

      timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.to(panel, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.24,
      });

      if (header) {
        timeline.to(
          header,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.2,
          },
          "-=0.12",
        );
      }

      if (items.length) {
        timeline.to(
          items,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.22,
            stagger: 0.035,
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

      timeline.to(items, { autoAlpha: 0, y: 8, duration: 0.1, stagger: 0.02 }, 0);
      if (header) {
        timeline.to(header, { autoAlpha: 0, y: 8, duration: 0.1 }, 0.02);
      }
      timeline.to(
        panel,
        {
          autoAlpha: 0,
          y: 10,
          scale: 0.985,
          duration: 0.16,
        },
        0.02,
      );
    }

    return () => {
      timeline.kill();
      gsap.set(panel, { clearProps: "transform,opacity,visibility" });
      if (header) {
        gsap.set(header, { clearProps: "transform,opacity,visibility" });
      }
      if (items.length) {
        gsap.set(items, { clearProps: "transform,opacity,visibility" });
      }
    };
  }, [notifications.length, open, reduceMotion, shouldRender]);

  return (
    <div className="notification-feed" aria-label="Notifications">
      {shouldRender ? (
        <section
          ref={panelRef}
          id="notification-feed-panel"
          className="notification-feed__panel"
          aria-label="Notification history"
        >
          <div className="notification-feed__header">
            <div>
              <p className="notification-feed__eyebrow">Notification log</p>
              <h3>Deck updates</h3>
            </div>
            <div className="notification-feed__header-actions">
              <button
                type="button"
                className="notification-feed__clear"
                onClick={onClear}
                disabled={!notifications.length}
              >
                Clear
              </button>
              <button
                type="button"
                className="notification-feed__close"
                onClick={onToggle}
                aria-label="Close notification log"
              >
                Close
              </button>
            </div>
          </div>

          <div className="notification-feed__list">
            {notifications.length ? (
              notifications.map((item) => (
                <article
                  key={item.id}
                  className={
                    item.tone === "alert"
                      ? "notification-feed__item notification-feed__item--alert"
                      : "notification-feed__item"
                  }
                >
                  <div className="notification-feed__item-meta">
                    <span>{item.timestamp}</span>
                    <span>{item.tone === "alert" ? "Alert" : "Update"}</span>
                  </div>
                  <strong>{item.title}</strong>
                  {item.description ? <p>{item.description}</p> : null}
                </article>
              ))
            ) : (
              <div className="notification-feed__empty">
                <p>No notifications yet.</p>
              </div>
            )}
          </div>
        </section>
      ) : null}

      <button
        type="button"
        className={open ? "notification-feed__toggle notification-feed__toggle--active" : "notification-feed__toggle"}
        aria-expanded={open}
        aria-controls={open ? "notification-feed-panel" : undefined}
        aria-label="Open notification log"
        onClick={onToggle}
      >
        <NotificationIcon />
        <span className="notification-feed__toggle-label">Updates</span>
        {notifications.length ? <span className="notification-feed__count">{Math.min(notifications.length, 99)}</span> : null}
      </button>
    </div>
  );
}
