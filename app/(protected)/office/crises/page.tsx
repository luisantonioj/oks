// app/(protected)/office/crises/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

// --- TYPES ---
type CrisisFeatures = {
  survey: boolean;
  help_button: boolean;
  progress: boolean;
  donation: boolean;
  volunteer: boolean;
};

type Crisis = {
  id: string;
  name: string;
  type: string;
  summary: string;
  description: string;
  affected_areas: string[];
  severity: string;
  status: string;
  students_at_risk: number;
  created_at: string;
  updated_at: string;
  help_requests: { id: string; name: string; location: string; status: string; time: string }[];
  announcements: { id: string; title: string; content: string; posted_at: string }[];
  progress_updates: { id: string; title: string; content: string; time: string; icon: string }[];
  volunteers: number;
  donations_count: number;
  features: CrisisFeatures;
};

// --- CONSTANTS ---
const crisisTypes = [
  "Typhoon", "Earthquake", "Flood", "Fire",
  "Volcanic Eruption", "Landslide", "Tsunami", "Other",
];

const optionalFeatures: { key: keyof CrisisFeatures; label: string; desc: string }[] = [
  { key: "survey",      label: "📋 Survey",      desc: "Collect safety status from stakeholders" },
  { key: "help_button", label: "🆘 Help Button",  desc: "Allow stakeholders to request assistance" },
  { key: "progress",    label: "📊 Progress",     desc: "Post community response updates" },
  { key: "donation",    label: "💝 Donation",     desc: "Accept donation pledges for relief" },
  { key: "volunteer",   label: "🙋 Volunteer",    desc: "Coordinate community volunteers" },
];

const defaultFeatures: CrisisFeatures = {
  survey: true, help_button: true, progress: true, donation: true, volunteer: true,
};

const emptyForm = { name: "", type: "", summary: "", affected_areas: "", severity: "high" };

// --- DUMMY DATA ---
const initialCrises: Crisis[] = [
  {
    id: "crisis-001",
    name: "Typhoon Jacinto",
    type: "Category 4 Typhoon",
    summary: "A strong typhoon making landfall in Northern Luzon with wind speeds of 150 km/h and storm surges of up to 4 meters expected.",
    description: "Typhoon Jacinto is a Category 4 super typhoon currently making landfall in Northern Luzon, Philippines. The storm is generating sustained winds of 150 km/h with gusts reaching 200 km/h. Storm surges of up to 4 meters are expected along coastal areas.",
    affected_areas: ["Lipa City", "Batangas City", "Malvar", "Mataasnakahoy"],
    severity: "high",
    status: "active",
    students_at_risk: 200,
    created_at: "2025-05-20T08:00:00Z",
    updated_at: "2025-05-20T14:30:00Z",
    help_requests: [
      { id: "hr-1", name: "Maria Santos", location: "Brgy. Tambo, Lipa City", status: "pending", time: "2 hours ago" },
      { id: "hr-2", name: "Juan Dela Cruz", location: "Brgy. Dagatan, Batangas City", status: "resolved", time: "5 hours ago" },
    ],
    announcements: [
      { id: "ann-1", title: "Answer the Survey", content: "Please answer the safety survey.", posted_at: "May 20, 2025, 10:32 AM" },
    ],
    progress_updates: [
      { id: "pu-1", title: "Food Distribution", content: "Serving 500+ families daily.", time: "15 minutes ago", icon: "🍱" },
    ],
    volunteers: 18,
    donations_count: 45,
    features: { survey: true, help_button: true, progress: true, donation: true, volunteer: true },
  },
  {
    id: "crisis-002",
    name: "Earthquake Batangas",
    type: "Magnitude 6.2 Earthquake",
    summary: "A strong earthquake struck Batangas province causing structural damage to several buildings and infrastructure.",
    description: "A magnitude 6.2 earthquake struck Batangas province at 3:22 AM local time. The epicenter was located 15km southwest of Batangas City at a depth of 10km.",
    affected_areas: ["Batangas City", "Taal", "Lemery"],
    severity: "high",
    status: "active",
    students_at_risk: 85,
    created_at: "2025-05-18T03:22:00Z",
    updated_at: "2025-05-19T10:00:00Z",
    help_requests: [
      { id: "hr-4", name: "Pedro Ramirez", location: "Taal, Batangas", status: "pending", time: "3 hours ago" },
    ],
    announcements: [
      { id: "ann-3", title: "Structural Safety Advisory", content: "Do not enter buildings that show visible cracks.", posted_at: "May 18, 2025, 06:00 AM" },
    ],
    progress_updates: [
      { id: "pu-5", title: "Search & Rescue", content: "All trapped individuals safely evacuated.", time: "2 hours ago", icon: "🚒" },
    ],
    volunteers: 9,
    donations_count: 23,
    features: { survey: true, help_button: true, progress: true, donation: false, volunteer: false },
  },
  {
    id: "crisis-003",
    name: "Flood — Lipa City",
    type: "Flash Flood",
    summary: "Heavy monsoon rains caused flash flooding in low-lying areas of Lipa City, displacing hundreds of families.",
    description: "Intense monsoon rainfall over 24 hours caused flash flooding in several barangays of Lipa City. Water levels reached up to 1.5 meters.",
    affected_areas: ["Barangay Tambo", "Barangay Halang", "Barangay Dagatan"],
    severity: "low",
    status: "resolved",
    students_at_risk: 40,
    created_at: "2025-05-10T11:00:00Z",
    updated_at: "2025-05-14T16:00:00Z",
    help_requests: [
      { id: "hr-6", name: "Rosa Villanueva", location: "Brgy. Tambo, Lipa City", status: "resolved", time: "4 days ago" },
    ],
    announcements: [
      { id: "ann-4", title: "All Clear — Flood Subsided", content: "Flood waters have fully receded.", posted_at: "May 14, 2025, 04:00 PM" },
    ],
    progress_updates: [
      { id: "pu-6", title: "Cleanup Complete", content: "All evacuation centers now closed.", time: "4 days ago", icon: "✅" },
    ],
    volunteers: 14,
    donations_count: 31,
    features: { survey: false, help_button: true, progress: true, donation: true, volunteer: true },
  },
];

// --- BADGES ---
function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    high: "bg-destructive/10 text-destructive border border-destructive/20",
    low: "bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    medium: "bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${styles[severity] ?? "bg-muted text-muted-foreground"}`}>
      {severity} severity
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-[#00C48C]/10 text-[#00C48C] border border-[#00C48C]/20",
    resolved: "bg-muted text-muted-foreground border border-border",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${styles[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-PH", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

// --- PAGE ---
export default function OfficeCrisesPage() {
  const [crises, setCrises] = useState<Crisis[]>(initialCrises);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
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

  function toggleFeature(key: keyof CrisisFeatures) {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
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

  const isOpen = modalMode !== null;
  const modalTitle = modalMode === "create" ? "Create New Crisis" : "Edit Crisis";
  const submitLabel = modalMode === "create" ? "Create Crisis" : "Save Changes";
  const successMsg = modalMode === "create" ? "✅ Crisis created successfully!" : "✅ Crisis updated successfully!";

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
            { label: "Total Crises", value: crises.length, color: "text-foreground" },
            { label: "Active", value: activeCrises.length, color: "text-[#00C48C]" },
            { label: "Resolved", value: resolvedCrises.length, color: "text-muted-foreground" },
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
                <div key={crisis.id} className="bg-card rounded-xl border border-border hover:border-[#00C48C] hover:shadow-md transition-all p-5 group">
                  <div className="flex items-start justify-between gap-4">
                    <Link href={`/office/crises/${crisis.id}`} className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-foreground text-base group-hover:text-[#00C48C] transition-colors">{crisis.name}</h3>
                        <StatusBadge status={crisis.status} />
                        <SeverityBadge severity={crisis.severity} />
                      </div>
                      <p className="text-xs text-[#00C48C] font-medium mb-2">{crisis.type}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{crisis.summary}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {crisis.affected_areas.map((area) => (
                          <span key={area} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{area}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-5 text-xs text-muted-foreground">
                        <span>🆘 <span className="font-semibold text-foreground">{crisis.help_requests.length}</span> help requests</span>
                        <span>🙋 <span className="font-semibold text-foreground">{crisis.volunteers}</span> volunteers</span>
                        <span>💝 <span className="font-semibold text-foreground">{crisis.donations_count}</span> donations</span>
                      </div>
                    </Link>
                    <div className="text-right shrink-0 flex flex-col items-end gap-2">
                      <p className="text-xs text-muted-foreground">Updated {formatDateTime(crisis.updated_at)}</p>
                      <p className="text-xs text-muted-foreground">Created {formatDateTime(crisis.created_at)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => openEdit(crisis)}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <Link href={`/office/crises/${crisis.id}`} className="text-xs font-medium text-[#00C48C] hover:underline">
                          View details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
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
                <div key={crisis.id} className="bg-card rounded-xl border border-border hover:border-muted-foreground transition-all p-5 group opacity-70 hover:opacity-100">
                  <div className="flex items-start justify-between gap-4">
                    <Link href={`/office/crises/${crisis.id}`} className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-foreground text-base">{crisis.name}</h3>
                        <StatusBadge status={crisis.status} />
                        <SeverityBadge severity={crisis.severity} />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium mb-2">{crisis.type}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{crisis.summary}</p>
                    </Link>
                    <div className="text-right shrink-0 flex flex-col items-end gap-2">
                      <p className="text-xs text-muted-foreground">Resolved {formatDate(crisis.updated_at)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => openEdit(crisis)}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <Link href={`/office/crises/${crisis.id}`} className="text-xs font-medium text-muted-foreground hover:text-foreground">
                          View details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card rounded-t-2xl">
              <h2 className="font-bold text-foreground text-lg">{modalTitle}</h2>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Crisis Name <span className="text-destructive">*</span></label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Typhoon Jacinto"
                  className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Crisis Type <span className="text-destructive">*</span></label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select a type...</option>
                  {crisisTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Summary <span className="text-destructive">*</span></label>
                <textarea rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Brief description of the crisis situation..."
                  className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Affected Areas <span className="text-destructive">*</span></label>
                <input type="text" value={form.affected_areas} onChange={(e) => setForm({ ...form, affected_areas: e.target.value })} placeholder="e.g., Lipa City, Batangas City, Taal"
                  className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <p className="text-xs text-muted-foreground mt-1">Separate multiple areas with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Severity</label>
                <div className="flex gap-3">
                  {[
                    { value: "low", label: "🟡 Low" },
                    { value: "medium", label: "🟠 Medium" },
                    { value: "high", label: "🔴 High" },
                  ].map((s) => (
                    <button key={s.value} type="button" onClick={() => setForm({ ...form, severity: s.value })}
                      className={`flex-1 text-sm font-medium py-2 rounded-lg border transition-colors ${
                        form.severity === s.value
                          ? s.value === "high" ? "bg-destructive/10 border-destructive text-destructive"
                            : s.value === "medium" ? "bg-orange-100 border-orange-400 text-orange-700 dark:bg-orange-900/20 dark:border-orange-600 dark:text-orange-400"
                            : "bg-yellow-100 border-yellow-400 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-600 dark:text-yellow-400"
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Features */}
              <div>
                <div className="mb-3">
                  <p className="text-sm font-medium text-foreground">Optional Features</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Home and Announcements are always enabled. Toggle the rest as needed.</p>
                </div>
                <div className="space-y-2 mb-3">
                  {[
                    { label: "🏠 Home", desc: "Crisis overview and details" },
                    { label: "📢 Announcements", desc: "Broadcast updates to stakeholders" },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center justify-between px-4 py-3 rounded-lg bg-muted/50 border border-border">
                      <div>
                        <p className="text-sm font-medium text-foreground">{f.label}</p>
                        <p className="text-xs text-muted-foreground">{f.desc}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Always on</span>
                        <div className="w-10 h-5 bg-[#00C48C] rounded-full opacity-50 cursor-not-allowed" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {optionalFeatures.map((f) => (
                    <div key={f.key} className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${features[f.key] ? "bg-[#00C48C]/5 border-[#00C48C]/30" : "bg-muted/30 border-border"}`}>
                      <div>
                        <p className={`text-sm font-medium ${features[f.key] ? "text-foreground" : "text-muted-foreground"}`}>{f.label}</p>
                        <p className="text-xs text-muted-foreground">{f.desc}</p>
                      </div>
                      <button type="button" onClick={() => toggleFeature(f.key)}
                        className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none ${features[f.key] ? "bg-[#00C48C]" : "bg-muted-foreground/30"}`}>
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${features[f.key] ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {formError && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{formError}</p>}
              {formSuccess && <p className="text-sm text-[#00C48C] bg-[#00C48C]/10 px-3 py-2 rounded-lg">{successMsg}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 text-sm font-medium py-2.5 rounded-lg border border-border text-foreground hover:bg-accent transition-colors">Cancel</button>
                <button type="submit" className="flex-1 text-sm font-semibold py-2.5 rounded-lg bg-[#00C48C] hover:bg-[#00a876] text-white transition-colors">{submitLabel}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}