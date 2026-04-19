import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useAlertMode } from "../context/AlertModeContext";

function areRenderedToastsEqual(left, right) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((toast, index) => {
    const other = right[index];

    return (
      toast.id === other.id &&
      toast.title === other.title &&
      toast.description === other.description &&
      toast.timestamp === other.timestamp &&
      toast.tone === other.tone &&
      toast.phase === other.phase
    );
  });
}

export default function ToastStack({ open, toasts, onDismiss }) {
  const stackRef = useRef(null);
  const enteredToastIdsRef = useRef(new Set());
  const exitingToastIdsRef = useRef(new Set());
  const previousHiddenToastCountRef = useRef(0);
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

      const nextRenderedToasts = [...nextVisible, ...exiting];

      return areRenderedToastsEqual(current, nextRenderedToasts) ? current : nextRenderedToasts;
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
      enteredToastIdsRef.current = new Set(
        renderedToasts
          .filter((toast) => toast.phase !== "exiting")
          .map((toast) => toast.id),
      );
      exitingToastIdsRef.current.clear();
      previousHiddenToastCountRef.current = hiddenToastCount;
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

    const enteringToasts = renderedToasts.filter((toast) => toast.phase === "entering");
    const exitingToasts = renderedToasts.filter((toast) => toast.phase === "exiting");

    enteringToasts.forEach((toast) => {
      if (enteredToastIdsRef.current.has(toast.id)) {
        return;
      }

      const element = stackRef.current?.querySelector(`[data-toast-id="${toast.id}"]`);

      if (!element) {
        return;
      }

      enteredToastIdsRef.current.add(toast.id);
      gsap.killTweensOf(element);
      gsap.set(element, { autoAlpha: 0, y: 14, x: 10 });
      gsap.to(element, {
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
    });

    exitingToasts.forEach((toast) => {
      if (exitingToastIdsRef.current.has(toast.id)) {
        return;
      }

      const element = stackRef.current?.querySelector(`[data-toast-id="${toast.id}"]`);
      exitingToastIdsRef.current.add(toast.id);

      if (!element) {
        enteredToastIdsRef.current.delete(toast.id);
        exitingToastIdsRef.current.delete(toast.id);
        setRenderedToasts((current) => current.filter((item) => item.id !== toast.id));
        return;
      }

      gsap.killTweensOf(element);
      gsap.set(element, { height: element.offsetHeight });
      gsap.to(element, {
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
          enteredToastIdsRef.current.delete(toast.id);
          exitingToastIdsRef.current.delete(toast.id);
          setRenderedToasts((current) => current.filter((item) => item.id !== toast.id));
        },
      });
    });

    const overflow = stackRef.current.querySelector(".toast-stack__overflow");
    if (overflow && hiddenToastCount > 0 && hiddenToastCount !== previousHiddenToastCountRef.current) {
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
    previousHiddenToastCountRef.current = hiddenToastCount;
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
