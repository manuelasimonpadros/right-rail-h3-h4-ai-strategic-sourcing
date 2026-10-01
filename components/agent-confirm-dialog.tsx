"use client";

import { useEffect } from "react";

type AgentConfirmDialogProps = {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  stayLabel: string;
  onConfirm: () => void;
  onStay: () => void;
};

/** Confirmation before an agent action that clears or abandons the buyer's work. */
export function AgentConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  stayLabel,
  onConfirm,
  onStay,
}: AgentConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onStay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onStay]);

  if (!open) return null;

  return (
    <div className="gate-scrim" role="presentation" onClick={onStay}>
      <div
        className="gate-card agent-confirm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="agent-confirm-title"
        aria-describedby="agent-confirm-sub"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="gate-close" aria-label="Close" onClick={onStay}>
          <l-icon name="xmark" />
        </button>
        <h2 id="agent-confirm-title" className="gate-title deep-draw-title mar-0">
          {title}
        </h2>
        <p id="agent-confirm-sub" className="gate-sub mar-0">
          {body}
        </p>
        <div className="deep-draw-actions">
          <button kind="primary" onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button kind="neutral" onClick={onStay} autoFocus>
            {stayLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
