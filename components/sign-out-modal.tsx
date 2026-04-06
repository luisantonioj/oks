"use client";

// components/sign-out-modal.tsx
// Uses createPortal so the modal renders at document.body level,
// completely outside the navbar DOM tree — prevents any z-index / overflow clipping.

import { signOut, adminSignOut } from "@/app/actions/auth";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface SignOutButtonProps {
  role?: "stakeholder" | "office" | "admin";
}

export function SignOutButton({ role = "stakeholder" }: SignOutButtonProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure we only render portal on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const action = role === "admin" ? adminSignOut : signOut;

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      {/* Dialog */}
      <div className="relative z-10 bg-background border border-border rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center">
        {/* X close */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <h2 className="text-xl font-bold mb-2">Sign out?</h2>
        <p className="text-sm text-muted-foreground mb-7 leading-relaxed">
          You'll be returned to the login page. Any unsaved changes will be lost.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setOpen(false)}
            className="flex-1 px-4 py-2.5 text-sm font-medium border border-border rounded-xl hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <form action={action} className="flex-1">
            <button
              type="submit"
              className="w-full px-4 py-2.5 text-sm font-semibold bg-foreground text-background rounded-xl hover:opacity-90 transition-opacity"
            >
              Yes, sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-muted-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-accent hover:text-foreground transition-colors whitespace-nowrap"
      >
        Sign Out
      </button>

      {/* Render modal at document.body to escape any parent stacking context */}
      {mounted && open && createPortal(modal, document.body)}
    </>
  );
}