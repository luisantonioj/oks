// app/(protected)/office/crises/CrisisDashboardClient.tsx
"use client";

import { useState } from "react";
import { Crisis, CrisisFeatures } from "@/components/crisis/crisis.types";
import { ActiveCrisisCard, ResolvedCrisisCard } from "@/components/crisis/CrisisCard";
import { CrisisModal, CrisisFormState } from "@/components/crisis/CrisisModal";

// Default states
const defaultFeatures: CrisisFeatures = {
  survey: false, help_button: false, progress: false, donation: false, volunteer: false,
  notify_stakeholders: true, sound_alarm: false, request_backup: false, lockdown_areas: false,
};

const emptyForm: CrisisFormState = {
  name: "", type: "", summary: "", affected_areas: "", severity: "medium", required_actions: "",
};

export function CrisisDashboardClient({ crises }: { crises: Crisis[] }) {
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<CrisisFormState>(emptyForm);
  const [features, setFeatures] = useState<CrisisFeatures>({ ...defaultFeatures });

  const activeCrises = crises.filter((c) => c.status === "active");
  const resolvedCrises = crises.filter((c) => c.status === "resolved");

  function openCreate() {
    setForm(emptyForm);
    setFeatures({ ...defaultFeatures });
    setModalMode("create");
  }

  function openEdit(crisis: Crisis) {
    setForm({
      id: crisis.id,
      name: crisis.name || "",
      type: crisis.type || "",
      summary: crisis.summary || "",
      affected_areas: crisis.affected_areas?.join(", ") || "",
      severity: crisis.severity || "medium",
      required_actions: crisis.required_actions || "",
    });
    setFeatures(crisis.features || { ...defaultFeatures });
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setForm(emptyForm);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Crisis Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Monitor and manage all active and past crises</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center gap-2 bg-[#00C48C] hover:bg-[#00a876] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
            <span className="text-lg leading-none">+</span> New Crisis
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Crises",  value: crises.length,          color: "text-foreground" },
            { label: "Active",        value: activeCrises.length,    color: "text-[#00C48C]" },
            { label: "Resolved",      value: resolvedCrises.length,  color: "text-muted-foreground" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-xl border border-border p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Active Crises */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Active Crises</h2>
          {activeCrises.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-10 text-center">
              <p className="text-muted-foreground text-sm">No active crises. All clear!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeCrises.map((crisis) => (
                <ActiveCrisisCard key={crisis.id} crisis={crisis} onEdit={openEdit} />
              ))}
            </div>
          )}
        </section>

        {/* Resolved Crises */}
        {resolvedCrises.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Resolved Crises</h2>
            <div className="space-y-3">
              {resolvedCrises.map((crisis) => (
                <ResolvedCrisisCard key={crisis.id} crisis={crisis} onEdit={openEdit} />
              ))}
            </div>
          </section>
        )}
      </div>

      {modalMode && (
        <CrisisModal
          mode={modalMode}
          form={form}
          features={features}
          onClose={closeModal}
          onFormChange={(updates) => setForm((prev) => ({ ...prev, ...updates }))}
          onToggleFeature={(key) => setFeatures((prev) => ({ ...prev, [key]: !prev[key] }))}
        />
      )}
    </div>
  );
}

export default CrisisDashboardClient;