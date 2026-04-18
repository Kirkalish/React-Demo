import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useAlertMode } from "../context/AlertModeContext";

export default function ToastStack({ open, toasts, onDismiss }) {
  const stackRef = useRef(null);
  const visibleToasts = toasts.slice(-3);
  const hiddenToastCount = Math.max(0, toasts.length - visibleToasts.length);
  const [renderedToasts, setRenderedToasts] = useState(() =>
    visibleToasts.map((toast) => ({ ...toast, phase: "present" })),
  );
  const {
    preferences: {
      accessibility: { reduceMotion },
    },
  } = useAlertMode();

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

  useEffect(() => {
    const nextVisibleIds = new Set(visibleToasts.map((toast) => toast.id));

    setRenderedToasts((current) => {
      const exiting = current
        .filter((item) => !nextVisibleIds.has(item.id))
        .map((item) => ({ ...item, phase: "exiting" }));

      const nextVisible = visibleToasts.map((toast) => {
        const existing = current.find((item) => item.id === toast.id);

        if (!existing) {
          return { ...toast, phase: "entering" };
        }

        return {
          ...existing,
          ...toast,
          phase: existing.phase === "exiting" ? "present" : existing.phase,
        };
      });

      return [...nextVisible, ...exiting];
    });
  }, [visibleToasts]);

  useLayoutEffect(() => {
    if (!open || !stackRef.current || !renderedToasts.length) {
      return;
    }

    if (reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(stackRef.current, { clearProps: "transform,opacity,visibility" });
      const children = stackRef.current.querySelectorAll(".toast-stack__overflow, .toast-stack__item");
      gsap.set(children, { clearProps: "transform,opacity,visibility,height,paddingTop,paddingBottom,marginTop,marginBottom" });
      setRenderedToasts((current) => {
        const next = current
          .filter((toast) => toast.phase !== "exiting")
          .map((toast) =>
            toast.phase === "present" ? toast : { ...toast, phase: "present" },
          );

        const unchanged =
          next.length === current.length &&
          next.every((toast, index) => toast === current[index]);

        return unchanged ? current : next;
      });
      return;
    }

    const cleanup = [];

    const enteringToasts = renderedToasts.filter((toast) => toast.phase === "entering");
    const exitingToasts = renderedToasts.filter((toast) => toast.phase === "exiting");

    enteringToasts.forEach((toast) => {
      const element = stackRef.current?.querySelector(`[data-toast-id="${toast.id}"]`);

      if (!element) {
        return;
      }

      gsap.killTweensOf(element);
      gsap.set(element, { autoAlpha: 0, y: 14, x: 10 });
      const tween = gsap.to(element, {
        autoAlpha: 1,
        y: 0,
        x: 0,
        duration: 0.24,
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
        onComplete: () => {
          setRenderedToasts((current) =>
            current.map((item) =>
              item.id === toast.id ? { ...item, phase: "present" } : item,
            ),
          );
        },
      });
      cleanup.push(() => tween.kill());
    });

    exitingToasts.forEach((toast) => {
      const element = stackRef.current?.querySelector(`[data-toast-id="${toast.id}"]`);

      if (!element) {
        setRenderedToasts((current) => current.filter((item) => item.id !== toast.id));
        return;
      }

      gsap.killTweensOf(element);
      gsap.set(element, { height: element.offsetHeight });
      const tween = gsap.to(element, {
        autoAlpha: 0,
        x: 16,
        y: -6,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
        duration: 0.2,
        ease: "power2.inOut",
        onComplete: () => {
          setRenderedToasts((current) => current.filter((item) => item.id !== toast.id));
        },
      });
      cleanup.push(() => tween.kill());
    });

    const overflow = stackRef.current.querySelector(".toast-stack__overflow");
    if (overflow && hiddenToastCount > 0) {
      gsap.killTweensOf(overflow);
      gsap.fromTo(
        overflow,
        { autoAlpha: 0, y: 10, x: 6 },
        {
          autoAlpha: 1,
          y: 0,
          x: 0,
          duration: 0.22,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
        },
      );
    }

    return () => {
      cleanup.forEach((fn) => fn());
    };
  }, [hiddenToastCount, open, reduceMotion, renderedToasts]);

  if (!open || (!toasts.length && !renderedToasts.length)) {
    return null;
  }

  return (
    <div ref={stackRef} className="toast-stack" aria-live="polite" aria-atomic="false">
      {hiddenToastCount > 0 ? (
        <div className="toast-stack__overflow" role="status" aria-label={`${hiddenToastCount} additional notifications`}>
          <strong>{hiddenToastCount}</strong>
          <span>{hiddenToastCount === 1 ? "other recent notification" : "other recent notifications"}</span>
        </div>
      ) : null}

      {renderedToasts.map((toast) => (
        <article
          key={toast.id}
          data-toast-id={toast.id}
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
