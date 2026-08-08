"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Modal behaviour shared by the photo lightboxes: keyboard navigation, body
 * scroll lock, and — the part that is easy to forget — focus management.
 *
 * Without this a keyboard or screen-reader user opens the viewer and focus
 * stays on the page behind it: Tab walks the hidden page, Escape is the only
 * way out, and on close focus is lost entirely. Here focus moves into the
 * dialog, is trapped inside it, and returns to the thumbnail that opened it.
 *
 * Returns the ref to attach to the dialog element.
 */
export function useLightbox({
  isOpen,
  onClose,
  onStep,
}: {
  isOpen: boolean;
  onClose: () => void;
  /** Called with -1 / +1 for Left / Right arrow. Omit for single images. */
  onStep?: (delta: number) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Remember what to hand focus back to, then move into the dialog.
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const first = dialog?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? dialog)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (onStep && event.key === "ArrowRight") {
        onStep(1);
        return;
      }
      if (onStep && event.key === "ArrowLeft") {
        onStep(-1);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      // Trap Tab: wrap from last back to first and vice versa.
      const items = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((node) => node.offsetParent !== null);
      if (items.length === 0) return;

      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === firstItem || active === dialogRef.current)) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && active === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      // Return focus to the thumbnail, so the reader keeps their place.
      returnFocusRef.current?.focus?.();
    };
  }, [isOpen, onClose, onStep]);

  return dialogRef;
}
