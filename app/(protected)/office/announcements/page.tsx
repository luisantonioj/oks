// app/(protected)/office/announcements/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

// --- DUMMY DATA ---
const initialAnnouncements = [
  {
    id: "ann-1",
    title: "Answer the Survey",
    content: "Please answer the safety survey to help us assess your current situation and provide timely assistance. This short survey takes less than 3 minutes to complete.",
    crisis: "Typhoon Jacinto",
    crisis_id: "crisis-001",
    priority: "high",
    posted_at: "May 20, 2025, 10:32 AM",
    read_count: 145,
  },
  {
    id: "ann-2",
    title: "Reminder: Stay Indoors",
    content: "All DLSL stakeholders are advised to stay indoors and avoid flood-prone areas. Classes are suspended until further notice. Please monitor official DLSL channels for updates.",
    crisis: "Typhoon Jacinto",
    crisis_id: "crisis-001",
    priority: "high",
    posted_at: "May 20, 2025, 09:00 AM",
    read_count: 213,
  },
  {
    id: "ann-3",
    title: "Structural Safety Advisory",
    content: "Do not enter buildings that show visible cracks or damage. Report any unsafe structures to ISESSO immediately. Our team is conducting inspections across the campus.",
    crisis: "Earthquake Batangas",
    crisis_id: "crisis-002",
    priority: "normal",
    posted_at: "May 18, 2025, 06:00 AM",
    read_count: 98,
  },
  {
    id: "ann-4",
    title: "All Clear — Flood Subsided",
    content: "Flood waters have fully receded. Families may return to their homes. Cleanup operations are underway with support from barangay officials and volunteers.",
    crisis: "Flood — Lipa City",
    crisis_id: "crisis-003",
    priority: "normal",
    posted_at: "May 14, 2025, 04:00 PM",
    read_count: 77,
  },
];

const dummyCrises = [
  { id: "crisis-001", name: "Typhoon Jacinto" },
  { id: "crisis-002", name: "Earthquake Batangas" },
  { id: "crisis-003", name: "Flood — Lipa City" },
];

type Announcement = typeof initialAnnouncements[number];

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${priority === "high" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
      {priority}
    </span>
  );
}

export default function OfficeAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [showCompose, setShowCompose] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCrisis, setFilterCrisis] = useState("all");
  const [form, setForm] = useState({ title: "", content: "", crisis_id: "", priority: "normal" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const filtered = filterCrisis === "all"
    ? announcements
    : announcements.filter((a) => a.crisis_id === filterCrisis);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim() || !form.crisis_id) {
      setFormError("Please fill in all required fields.");
      return;
    }
    const crisis = dummyCrises.find((c) => c.id === form.crisis_id);
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: form.title,
      content: form.content,
      crisis: crisis?.name ?? "Unknown",
      crisis_id: form.crisis_id,
      priority: form.priority,
      posted_at: new Date().toLocaleString("en-PH", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }),
      read_count: 0,
    };
    setAnnouncements([newAnn, ...announcements]);
    setForm({ title: "", content: "", crisis_id: "", priority: "normal" });
    setFormError("");
    setFormSuccess(true);
    setTimeout(() => { setFormSuccess(false); setShowCompose(false); }, 1500);
  }

  function handleDelete(id: string) {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    setDeleteId(null);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Broadcast updates to all stakeholders
            </p>
          </div>
          <button
            onClick={() => setShowCompose(true)}
            className="inline-flex items-center gap-2 bg-[#00C48C] hover:bg-[#00a876] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            📢 Compose
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Filter */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground font-medium">Filter by crisis:</span>
          <select
            value={filterCrisis}
            onChange={(e) => setFilterCrisis(e.target.value)}
            className="text-sm border border-input rounded-lg px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Crises</option>
            {dummyCrises.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <span className="text-xs text-muted-foreground ml-auto">
            {filtered.length} announcement{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Announcements List */}
        {filtered.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-10 text-center">
            <p className="text-muted-foreground text-sm">No announcements available.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((ann) => (
              <div key={ann.id} className="bg-card rounded-xl border border-border overflow-hidden">
                <div
                  className="p-5 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setExpandedId(expandedId === ann.id ? null : ann.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-foreground">{ann.title}</h3>
                        <PriorityBadge priority={ann.priority} />
                      </div>
                      <p className="text-xs text-[#00C48C] font-medium mb-1">{ann.crisis}</p>
                      {expandedId !== ann.id && (
                        <p className="text-sm text-muted-foreground line-clamp-1">{ann.content}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">{ann.posted_at}</p>
                      <p className="text-xs text-muted-foreground mt-1">{ann.read_count} reads</p>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === ann.id && (
                  <div className="px-5 pb-4 border-t border-border">
                    <p className="text-sm text-muted-foreground leading-relaxed mt-3">{ann.content}</p>
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() => setDeleteId(ann.id)}
                        className="text-xs text-destructive hover:text-destructive/80 font-medium transition-colors"
                      >
                        🗑 Delete
                      </button>
                      <Link
                        href={`/office/crises/${ann.crisis_id}`}
                        className="text-xs text-[#00C48C] hover:underline font-medium"
                      >
                        View crisis →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg border border-border">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-bold text-foreground text-lg">Compose Announcement</h2>
              <button
                onClick={() => { setShowCompose(false); setFormError(""); setFormSuccess(false); }}
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

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Stay Indoors Advisory"
                  className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Content <span className="text-destructive">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your announcement here..."
                  className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
                <div className="flex gap-3">
                  {["normal", "high"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm({ ...form, priority: p })}
                      className={`flex-1 text-sm font-medium py-2 rounded-lg border transition-colors capitalize ${
                        form.priority === p
                          ? p === "high"
                            ? "bg-destructive/10 border-destructive text-destructive"
                            : "bg-[#00C48C]/10 border-[#00C48C] text-[#00C48C]"
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {p === "high" ? "🔴 High" : "⚪ Normal"}
                    </button>
                  ))}
                </div>
              </div>

              {formError && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{formError}</p>
              )}
              {formSuccess && (
                <p className="text-sm text-[#00C48C] bg-[#00C48C]/10 px-3 py-2 rounded-lg">
                  ✅ Announcement posted successfully!
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="flex-1 text-sm font-medium py-2.5 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 text-sm font-semibold py-2.5 rounded-lg bg-[#00C48C] hover:bg-[#00a876] text-white transition-colors"
                >
                  Post Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-border">
            <h2 className="font-bold text-foreground text-lg mb-2">Delete Announcement?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This action cannot be undone. The announcement will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 text-sm font-medium py-2.5 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 text-sm font-semibold py-2.5 rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}