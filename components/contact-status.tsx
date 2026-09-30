"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { UNCONTACTABLE_NOTE } from "@/lib/suppliers";

export const CONTACTABLE_NOTE = "This supplier can be contacted through Thomas.";

/** An envelope with a diagonal slash, drawn to sit with the icon set's regular weight. */
export function MailSlashIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M13.6 4.4V3.6a1 1 0 0 0-1-1H3.4a1 1 0 0 0-1 1v6.8a1 1 0 0 0 1 1h5.5" />
      <path d="M2.6 4.2 8 8.2l2.6-1.9" />
      <path d="M13.4 6.2v4.2a1 1 0 0 1-1 1h-.6" />
      <path d="M2 14 14 2" />
    </svg>
  );
}

/** A green, glossy envelope with a check — the positive counterpart to the gold verified shield. */
export function MailCheckBadge({ size = 18 }: { size?: number }) {
  const id = useId();
  const body = `${id}-body`;
  const dot = `${id}-dot`;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={body} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fd58a" />
          <stop offset="0.55" stopColor="#2fb25f" />
          <stop offset="1" stopColor="#1a8a49" />
        </linearGradient>
        <linearGradient id={dot} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dff5e6" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="4" width="21" height="15" rx="2.6" fill={`url(#${body})`} stroke="#167a40" strokeWidth="1" />
      <path d="M1.5 6.4 12 13l10.5-6.6" fill="none" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2" y="4.4" width="20" height="5" rx="2.2" fill="#ffffff" fillOpacity="0.14" />
      <circle cx="18.2" cy="17.6" r="5.2" fill={`url(#${dot})`} stroke="#167a40" strokeWidth="1" />
      <path d="m15.7 17.7 1.9 1.9 3.3-3.6" fill="none" stroke="#1a8a49" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type TipPlacement = { left: number; top: number; above: boolean };

export function placeTip(el: HTMLElement): TipPlacement {
  const rect = el.getBoundingClientRect();
  const above = rect.top > 80;
  return {
    left: Math.max(8, Math.min(rect.left, window.innerWidth - 240 - 8)),
    top: above ? rect.top - 6 : rect.bottom + 6,
    above,
  };
}

/**
 * The contactability marker on a supplier card: a green badge when Thomas can
 * route a request, a struck-through envelope when it can't. Hover or focus
 * shows the reason; a tap toggles it, since touch has no hover.
 */
export function ContactStatus({ contactable }: { contactable: boolean }) {
  const [tip, setTip] = useState<TipPlacement | null>(null);
  const note = contactable ? CONTACTABLE_NOTE : UNCONTACTABLE_NOTE;

  useEffect(() => {
    if (!tip) return;
    const close = () => setTip(null);
    const closeOutside = (event: PointerEvent) => {
      if (!(event.target as Element | null)?.closest?.(".contact-status")) close();
    };
    document.addEventListener("pointerdown", closeOutside);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      window.removeEventListener("scroll", close, true);
    };
  }, [tip]);

  return (
    <>
      <button
        type="button"
        className={`contact-status ${contactable ? "is-contactable" : "is-blocked"}`}
        aria-label={note}
        onMouseEnter={(event) => setTip(placeTip(event.currentTarget))}
        onMouseLeave={() => setTip(null)}
        onFocus={(event) => setTip(placeTip(event.currentTarget))}
        onBlur={() => setTip(null)}
        onClick={(event) => setTip(placeTip(event.currentTarget))}
      >
        {contactable ? <MailCheckBadge /> : <MailSlashIcon size={18} />}
      </button>
      {tip &&
        createPortal(
          <div
            className="rail-tip"
            role="tooltip"
            style={{ left: tip.left, top: tip.top, transform: tip.above ? "translateY(-100%)" : undefined }}
          >
            {note}
          </div>,
          document.body,
        )}
    </>
  );
}
