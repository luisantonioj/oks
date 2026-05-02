//components/crisis/CrisisDetailActionsClient.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CrisisModal, CrisisFormState } from "./CrisisModal";
import { CrisisFeatures } from "./crisis.types";
import { updateCrisisStatus, deleteCrisis } from "@/app/actions/crisis";

const blankFeatures: CrisisFeatures = {
  survey: false, help_button: false, progress: false, donation: false, volunteer: false,
  notify_stakeholders: false, sound_alarm: false, request_backup: false, lockdown_areas: false,
};

interface Props {
  id: string;
  name: string;
  type: string;
  summary: string;
  affected_areas: string[];
  severity: string;
  required_actions?: string;
  status: string;
  features?: Partial<CrisisFeatures>;
}

export function CrisisDetailActionsClient(crisis: Props) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<CrisisFormState>({
    id: crisis.id,
    name: crisis.name || "",
    type: crisis.type || "",
    summary: crisis.summary || "",
    affected_areas: crisis.affected_areas?.join(", ") || "",
    severity: crisis.severity || "medium",
    required_actions: crisis.required_actions || "",
  });
  const [features, setFeatures] = useState<CrisisFeatures>({ ...blankFeatures, ...(crisis.features || {}) });

  function handleResolve() {
    startTransition(async () => {
      await updateCrisisStatus(crisis.id, "resolved");
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
        const result = await deleteCrisis(crisis.id);
        if (!result.error) {
        router.push("/office/crises");
        }
        setDeleteOpen(false);
    });
    }

  return (
    <>
      <button
        onClick={() => setEditOpen(true)}
        className="text-sm bg-muted hover:bg-accent text-foreground font-medium px-4 py-2 rounded-lg border border-border transition-colors"
      >
        ✏️ Edit
      </button>
      {crisis.status === "active" && (
        <button
          onClick={handleResolve}
          disabled={isPending}
          className="text-sm bg-muted hover:bg-accent text-foreground font-medium px-4 py-2 rounded-lg border border-border transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Mark as Resolved"}
        </button>
      )}
      <button
        onClick={() => setDeleteOpen(true)}
        className="text-sm bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium px-4 py-2 rounded-lg border border-destructive transition-colors"
        >
        🗑️ Delete
      </button>
      {editOpen && (
        <CrisisModal
          mode="edit"
          form={formState}
          features={features}
          onClose={() => { setEditOpen(false); router.refresh(); }}
          onFormChange={(u) => setFormState((p) => ({ ...p, ...u }))}
          onToggleFeature={(key) => setFeatures((p) => ({ ...p, [key]: !p[key] }))}
        />
      )}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background border border-border rounded-xl p-6 max-w-sm w-full mx-4 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground mb-2">Delete Crisis</h2>
            <p className="text-sm text-muted-foreground mb-6">
                Are you sure you want to delete <span className="font-medium text-foreground">{crisis.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
                <button
                onClick={() => setDeleteOpen(false)}
                disabled={isPending}
                className="text-sm bg-muted hover:bg-accent text-foreground font-medium px-4 py-2 rounded-lg border border-border transition-colors disabled:opacity-50"
                >
                Cancel
                </button>
                <button
                onClick={handleDelete}
                disabled={isPending}
                className="text-sm bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                {isPending ? "Deleting..." : "Delete"}
                </button>
            </div>
            </div>
        </div>
        )}
    </>
  );
}