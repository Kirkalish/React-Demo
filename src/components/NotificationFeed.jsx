import React from "react";

function NotificationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="notification-feed__icon">
      <path d="M12 4.5a4.5 4.5 0 0 0-4.5 4.5v2.4c0 .8-.22 1.57-.64 2.26L5.8 15.4c-.37.59.05 1.35.75 1.35h10.9c.7 0 1.12-.76.75-1.35l-1.06-1.75a4.3 4.3 0 0 1-.64-2.26V9A4.5 4.5 0 0 0 12 4.5Z" />
      <path d="M9.7 18.4a2.55 2.55 0 0 0 4.6 0" />
    </svg>
  );
}

export default function NotificationFeed({ open, onToggle, notifications, onClear }) {
  return (
    <div className="notification-feed" aria-label="Notifications">
      {open ? (
        <section id="notification-feed-panel" className="notification-feed__panel" aria-label="Notification history">
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
