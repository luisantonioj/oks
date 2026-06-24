// features/crisis/DeleteCrisisModal.tsx
"use client";

import { useState } from "react";
import { deleteCrisis } from "@/app/actions/crisis";
import { useRouter } from "next/navigation";
import { ModalShell } from "@/components/ui/modal-shell";

interface DeleteCrisisModalProps {
  crisisId: string;
  crisisName: string;
  onClose: () => void;
  onSuccess?: () => void; // Optional: To handle UI updates or redirects
}

export function DeleteCrisisModal({ crisisId, crisisName, onClose, onSuccess }: DeleteCrisisModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleDelete() {
    setIsDeleting(true);
    setError("");

    const result = await deleteCrisis(crisisId);

    if (result.error) {
      setError(result.error);
      setIsDeleting(false);
    } else {
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/office/crises"); // Redirect to dashboard if on detail page
      }
      onClose();
    }
  }

  return (
    <ModalShell contentClassName="max-w-md" zIndexClassName="z-[60]">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md border border-border p-6 relative">
        <h2 className="text-xl font-bold text-foreground mb-2">Delete Crisis?</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete <span className="font-semibold text-foreground">&quot;{crisisName}&quot;</span>? This action cannot be undone and will remove all associated data.
        </p>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            disabled={isDeleting}
            className="flex-1 text-sm font-medium py-2.5 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="flex-1 text-sm font-semibold py-2.5 rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-colors"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
