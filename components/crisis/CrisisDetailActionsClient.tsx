//components/crisis/CrisisDetailActionsClient.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CrisisModal, CrisisFormState } from "./CrisisModal";
import { CrisisFeatures } from "./crisis.types";
import { updateCrisisStatus } from "@/app/actions/crisis";

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
    </>
  );
}