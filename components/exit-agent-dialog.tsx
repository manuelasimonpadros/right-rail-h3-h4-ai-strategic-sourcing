"use client";

import { useEffect } from "react";

type ExitAgentDialogProps = {
  open: boolean;
  /** Leave the agent and go back to the legacy (Thomas Classic) experience. */
  onConfirm: () => void;
  /** Stay in the agent. */
  onStay: () => void;
};

/**
 * Confirmation before opting out of the agent: it explains where the buyer
 * lands and that their answers are kept if they come back.
 */
export function ExitAgentDialog({ open, onConfirm, onStay }: ExitAgentDialogProps) {
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
        className="gate-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="exit-agent-title"
        aria-describedby="exit-agent-sub"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="gate-close" aria-label="Close" onClick={onStay}>
          <l-icon name="xmark" />
        </button>
        <h2 id="exit-agent-title" className="gate-title deep-draw-title mar-0">
          Exit the agent and go back to Thomas Classic?
        </h2>
        <p id="exit-agent-sub" className="gate-sub mar-0">
          You&apos;ll see the standard Thomas search results. Your answers are saved, so you can pick
          up where you left off if you open the agent again.
        </p>
        <div className="deep-draw-actions">
          <button kind="primary" onClick={onConfirm}>
            Exit agent
          </button>
          <button kind="neutral" onClick={onStay} autoFocus>
            Stay
          </button>
        </div>
      </div>
    </div>
  );
}
