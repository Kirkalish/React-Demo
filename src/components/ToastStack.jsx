import React, { useEffect } from "react";

export default function ToastStack({ open, toasts, onDismiss }) {
  const visibleToasts = toasts.slice(-3);
  const hiddenToastCount = Math.max(0, toasts.length - visibleToasts.length);

  useEffect(() => {
    if (!toasts.length) {
      return undefined;
    }

    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        onDismiss(toast.id);
      }, toast.tone === "alert" ? 5200 : 4200),
    );

    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [onDismiss, toasts]);

  if (!open || !toasts.length) {
    return null;
  }

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="false">
      {hiddenToastCount > 0 ? (
        <div className="toast-stack__overflow" role="status" aria-label={`${hiddenToastCount} additional notifications`}>
          <strong>{hiddenToastCount}</strong>
          <span>{hiddenToastCount === 1 ? "other recent notification" : "other recent notifications"}</span>
        </div>
      ) : null}

      {visibleToasts.map((toast) => (
        <article
          key={toast.id}
          className={toast.tone === "alert" ? "toast-stack__item toast-stack__item--alert" : "toast-stack__item"}
        >
          <div className="toast-stack__copy">
            <strong>{toast.title}</strong>
            {toast.description ? <p>{toast.description}</p> : null}
          </div>
          <button type="button" className="toast-stack__dismiss" onClick={() => onDismiss(toast.id)}>
            Dismiss
          </button>
        </article>
      ))}
    </div>
  );
}
