// app/(protected)/office/crises/page.tsx
"use client";

import { useState } from "react";
import { Crisis, CrisisFeatures } from "../../../../components/crisis/crisis.types";
import { defaultFeatures, emptyForm, initialCrises } from "../../../../components/crisis/crisis.data";
import { ActiveCrisisCard, ResolvedCrisisCard } from "../../../../components/crisis/CrisisCard";
import { CrisisModal, CrisisFormState } from "../../../../components/crisis/CrisisModal";

export default function OfficeCrisesPage() {
  const [crises, setCrises] = useState<Crisis[]>(initialCrises);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CrisisFormState>(emptyForm);
  const [features, setFeatures] = useState<CrisisFeatures>({ ...defaultFeatures });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const activeCrises = crises.filter((c) => c.status === "active");
  const resolvedCrises = crises.filter((c) => c.status === "resolved");

  function openCreate() {
    setForm(emptyForm);
    setFeatures({ ...defaultFeatures });
    setFormError("");
    setFormSuccess(false);
    setEditingId(null);
    setModalMode("create");
  }

  function openEdit(crisis: Crisis) {
    setForm({
      name: crisis.name,
      type: crisis.type,
      summary: crisis.summary,
      affected_areas: crisis.affected_areas.join(", "),
      severity: crisis.severity,
    });
    setFeatures({ ...crisis.features });
    setFormError("");
    setFormSuccess(false);
    setEditingId(crisis.id);
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setEditingId(null);
    setFormError("");
    setFormSuccess(false);
    setForm(emptyForm);
    setFeatures({ ...defaultFeatures });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.type || !form.summary.trim() || !form.affected_areas.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const now = new Date().toISOString();
    const areas = form.affected_areas.split(",").map((a) => a.trim()).filter(Boolean);

    if (modalMode === "create") {
      const newCrisis: Crisis = {
        id: `crisis-${Date.now()}`,
        name: form.name.trim(),
        type: form.type,
        summary: form.summary.trim(),
        description: form.summary.trim(),
        affected_areas: areas,
        severity: form.severity,
        status: "active",
        students_at_risk: 0,
        created_at: now,
        updated_at: now,
        help_requests: [],
        announcements: [],
        progress_updates: [],
        volunteers: 0,
        donations_count: 0,
        features: { ...features },
      };
      setCrises([newCrisis, ...crises]);
    } else if (modalMode === "edit" && editingId) {
      setCrises(crises.map((c) =>
        c.id === editingId
          ? { ...c, name: form.name.trim(), type: form.type, summary: form.summary.trim(), affected_areas: areas, severity: form.severity, features: { ...features }, updated_at: now }
          : c
      ));
    }

    setFormSuccess(true);
    setTimeout(() => { setFormSuccess(false); closeModal(); }, 1500);
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
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-[#00C48C] hover:bg-[#00a876] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
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

      {/* Modal */}
      {modalMode && (
        <CrisisModal
          mode={modalMode}
          form={form}
          features={features}
          formError={formError}
          formSuccess={formSuccess}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onFormChange={(updates) => setForm((prev) => ({ ...prev, ...updates }))}
          onToggleFeature={(key) => setFeatures((prev) => ({ ...prev, [key]: !prev[key] }))}
        />
      )}
    </div>
  );
}