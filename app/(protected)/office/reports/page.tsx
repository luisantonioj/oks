// app/(protected)/office/reports/page.tsx
"use client";

import { useState } from "react";

// --- DUMMY DATA ---
const dummyCrises = [
  { id: "crisis-001", name: "Typhoon Jacinto", status: "active" },
  { id: "crisis-002", name: "Earthquake Batangas", status: "active" },
  { id: "crisis-003", name: "Flood — Lipa City", status: "resolved" },
];

const iconOptions = ["🍱", "🏥", "👥", "🏗️", "🚒", "✅", "📦", "💧", "⚡", "🔧"];

const initialReports = [
  {
    id: "rpt-1",
    crisis: "Typhoon Jacinto",
    crisis_id: "crisis-001",
    title: "Food Distribution",
    content: "Food distribution center in Barangay San Miguel is now fully operational. Serving 500+ families daily. Volunteers are coordinating smoothly with barangay officials.",
    icon: "🍱",
    posted_by: "CIO Office",
    posted_at: "May 20, 2025, 12:15 PM",
    timestamp: new Date("2025-05-20T12:15:00").getTime(),
  },
  {
    id: "rpt-2",
    crisis: "Typhoon Jacinto",
    crisis_id: "crisis-001",
    title: "Medical Team Deployed",
    content: "Medical team successfully treated 45 patients today. Minor injuries mostly, everyone is recovering well. First aid stations are operational at 3 evacuation centers.",
    icon: "🏥",
    posted_by: "ISESSO",
    posted_at: "May 20, 2025, 11:30 AM",
    timestamp: new Date("2025-05-20T11:30:00").getTime(),
  },
  {
    id: "rpt-3",
    crisis: "Typhoon Jacinto",
    crisis_id: "crisis-001",
    title: "Youth Volunteer Cleanup",
    content: "Youth volunteers organized a cleanup drive on Main Street. Amazing community spirit! Over 60 volunteers participated clearing debris from 3 barangays.",
    icon: "👥",
    posted_by: "CIO Office",
    posted_at: "May 20, 2025, 07:00 AM",
    timestamp: new Date("2025-05-20T07:00:00").getTime(),
  },
  {
    id: "rpt-4",
    crisis: "Earthquake Batangas",
    crisis_id: "crisis-002",
    title: "Search & Rescue Complete",
    content: "Search and rescue operations completed. All trapped individuals have been safely evacuated. Structural assessment teams are now conducting building inspections.",
    icon: "🚒",
    posted_by: "ISESSO",
    posted_at: "May 19, 2025, 10:00 AM",
    timestamp: new Date("2025-05-19T10:00:00").getTime(),
  },
  {
    id: "rpt-5",
    crisis: "Flood — Lipa City",
    crisis_id: "crisis-003",
    title: "Cleanup Complete",
    content: "Community cleanup operations completed. All evacuation centers are now closed. Families have returned to their homes and normalcy is restored.",
    icon: "✅",
    posted_by: "CIO Office",
    posted_at: "May 14, 2025, 04:00 PM",
    timestamp: new Date("2025-05-14T16:00:00").getTime(),
  },
];

type Report = typeof initialReports[number];

export default function OfficeReportsPage() {
  const [reports, setReports] = useState(initialReports);
  const [showForm, setShowForm] = useState(false);
  const [filterCrisis, setFilterCrisis] = useState("all");
  const [selectedIcon, setSelectedIcon] = useState("📦");
  const [form, setForm] = useState({ crisis_id: "", title: "", content: "", posted_by: "CIO Office" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const filtered = filterCrisis === "all"
    ? [...reports].sort((a, b) => b.timestamp - a.timestamp)
    : [...reports].filter((r) => r.crisis_id === filterCrisis).sort((a, b) => b.timestamp - a.timestamp);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.crisis_id || !form.title.trim() || !form.content.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }
    const crisis = dummyCrises.find((c) => c.id === form.crisis_id);
    const now = new Date();
    const newReport: Report = {
      id: `rpt-${Date.now()}`,
      crisis: crisis?.name ?? "Unknown",
      crisis_id: form.crisis_id,
      title: form.title,
      content: form.content,
      icon: selectedIcon,
      posted_by: form.posted_by,
      posted_at: now.toLocaleString("en-PH", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }),
      timestamp: now.getTime(),
    };
    setReports([newReport, ...reports]);
    setForm({ crisis_id: "", title: "", content: "", posted_by: "CIO Office" });
    setSelectedIcon("📦");
    setFormError("");
    setFormSuccess(true);
    setTimeout(() => { setFormSuccess(false); setShowForm(false); }, 1500);
  }

  const reportsByCrisis = dummyCrises.map((c) => ({
    ...c,
    count: reports.filter((r) => r.crisis_id === c.id).length,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Progress Reports</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Real-time community response and recovery updates
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-[#00C48C] hover:bg-[#00a876] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            📝 Add Update
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-6 items-start">

          {/* LEFT COLUMN — Crisis List */}
          <div className="w-64 shrink-0 sticky top-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Crises
            </p>
            <div className="space-y-2">
              {/* "All" option */}
              <button
                onClick={() => setFilterCrisis("all")}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  filterCrisis === "all"
                    ? "bg-[#00C48C]/10 border-[#00C48C]"
                    : "bg-card border-border hover:border-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">All Crises</p>
                  <span className="text-xs font-bold text-muted-foreground">
                    {reports.length}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {reports.length} total update{reports.length !== 1 ? "s" : ""}
                </p>
              </button>

              {/* Individual crisis buttons */}
              {reportsByCrisis.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilterCrisis(c.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    filterCrisis === c.id
                      ? "bg-[#00C48C]/10 border-[#00C48C]"
                      : "bg-card border-border hover:border-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full capitalize ${
                      c.status === "active"
                        ? "bg-[#00C48C]/10 text-[#00C48C]"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {c.status}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">{c.count}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-tight">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {c.count} update{c.count !== 1 ? "s" : ""}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN — Reports Feed */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Community Updates
                </p>
                <p className="text-sm text-foreground font-semibold mt-0.5">
                  {filterCrisis === "all"
                    ? "All Crises"
                    : reportsByCrisis.find((c) => c.id === filterCrisis)?.name}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {filtered.length} update{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="bg-card rounded-xl border border-border divide-y divide-border">
              {filtered.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-muted-foreground text-sm">
                    No updates yet. Check back later.
                  </p>
                </div>
              ) : (
                filtered.map((report) => (
                  <div key={report.id} className="flex items-start gap-4 p-5">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                      {report.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-foreground">{report.title}</p>
                          <p className="text-xs text-[#00C48C] font-medium">{report.crisis}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-muted-foreground">{report.posted_at}</p>
                          <p className="text-xs text-muted-foreground/60 mt-0.5">
                            by {report.posted_by}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {report.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Add Update Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card rounded-t-2xl">
              <h2 className="font-bold text-foreground text-lg">Add Progress Update</h2>
              <button
                onClick={() => { setShowForm(false); setFormError(""); setFormSuccess(false); }}
                className="text-muted-foreground hover:text-foreground text-xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Crisis */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Crisis <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.crisis_id}
                  onChange={(e) => setForm({ ...form, crisis_id: e.target.value })}
                  className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select a crisis...</option>
                  {dummyCrises.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all ${
                        selectedIcon === icon
                          ? "bg-[#00C48C]/20 ring-2 ring-[#00C48C]"
                          : "bg-muted hover:bg-accent"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Update Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Food Distribution Update"
                  className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Update Details <span className="text-destructive">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Describe the progress update in detail..."
                  className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Posted By */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Posted By</label>
                <select
                  value={form.posted_by}
                  onChange={(e) => setForm({ ...form, posted_by: e.target.value })}
                  className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>CIO Office</option>
                  <option>ISESSO</option>
                  <option>ICTC</option>
                </select>
              </div>

              {formError && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{formError}</p>
              )}
              {formSuccess && (
                <p className="text-sm text-[#00C48C] bg-[#00C48C]/10 px-3 py-2 rounded-lg">
                  ✅ Progress update posted!
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 text-sm font-medium py-2.5 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 text-sm font-semibold py-2.5 rounded-lg bg-[#00C48C] hover:bg-[#00a876] text-white transition-colors"
                >
                  Post Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}