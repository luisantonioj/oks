// app/(protected)/office/announcements/AnnouncementsClient.tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Announcement, Crisis } from "@/types/database";
import { createAnnouncement, deleteAnnouncement, updateAnnouncement } from "@/app/actions/announcements";

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${priority === "high" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
      {priority}
    </span>
  );
}

interface AnnouncementsClientProps {
  initialAnnouncements: Announcement[];
  crises: Crisis[];
}

export default function AnnouncementsClient({ initialAnnouncements, crises }: AnnouncementsClientProps) {
  const [showCompose, setShowCompose] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCrisis, setFilterCrisis] = useState("all");
  
  // NEW: Track if we are editing an existing announcement
  const [editId, setEditId] = useState<string | null>(null);
  
  const [form, setForm] = useState({ title: "", content: "", crisis_id: "", priority: "normal" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  
  const [isPending, startTransition] = useTransition();

  const filtered = filterCrisis === "all"
    ? initialAnnouncements
    : initialAnnouncements.filter((a) => a.crisis_id === filterCrisis);

  // Opens the modal and populates it with the existing data
  function handleEditClick(ann: Announcement) {
    setEditId(ann.id);
    setForm({
      title: ann.title,
      content: ann.content,
      crisis_id: ann.crisis_id,
      priority: ann.priority || "normal",
    });
    setShowCompose(true);
  }

  // Resets the modal entirely
  function closeAndResetModal() {
    setShowCompose(false);
    setEditId(null);
    setFormError("");
    setFormSuccess(false);
    setForm({ title: "", content: "", crisis_id: "", priority: "normal" });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim() || !form.crisis_id) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("crisis_id", form.crisis_id);
    formData.append("priority", form.priority);
    
    // If editing, append the ID so the backend knows which row to update
    if (editId) {
      formData.append("id", editId);
    }

    startTransition(async () => {
      // Smartly choose which server action to call
      const result = editId 
        ? await updateAnnouncement(formData)
        : await createAnnouncement(formData);
      
      if (result.error) {
        setFormError(result.error);
      } else {
        setFormError("");
        setFormSuccess(true);
        setTimeout(() => { 
          closeAndResetModal();
        }, 1500);
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteAnnouncement(id);
      setDeleteId(null);
    });
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
            onClick={() => {
              setEditId(null); // Ensure it's a blank slate for "Compose"
              setShowCompose(true);
            }}
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
            {crises.map((c) => (
              <option key={c.id} value={c.id}>{c.name || c.type}</option>
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
            {filtered.map((ann) => {
              const crisisName = crises.find(c => c.id === ann.crisis_id)?.name || 'Unknown Crisis';
              const postedAt = new Date(ann.created_at).toLocaleString("en-PH", {
                month: "short", day: "numeric", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              });

              return (
                <div key={ann.id} className={`bg-card rounded-xl border border-border overflow-hidden ${isPending && (deleteId === ann.id || editId === ann.id) ? 'opacity-50' : ''}`}>
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
                        <p className="text-xs text-[#00C48C] font-medium mb-1">{crisisName}</p>
                        {expandedId !== ann.id && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{ann.content}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">{postedAt}</p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedId === ann.id && (
                    <div className="px-5 pb-4 border-t border-border">
                      <p className="text-sm text-muted-foreground leading-relaxed mt-3 whitespace-pre-wrap">{ann.content}</p>
                      <div className="flex items-center gap-3 mt-4">
                        <button
                          onClick={() => handleEditClick(ann)}
                          className="text-xs text-[#00C48C] hover:text-[#00a876] font-medium transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(ann.id)}
                          className="text-xs text-destructive hover:text-destructive/80 font-medium transition-colors"
                        >
                          🗑 Delete
                        </button>
                        <Link
                          href={`/office/crises/${ann.crisis_id}`}
                          className="text-xs text-muted-foreground hover:underline font-medium ml-auto"
                        >
                          View crisis →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Compose/Edit Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg border border-border">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-bold text-foreground text-lg">
                {editId ? "Edit Announcement" : "Compose Announcement"}
              </h2>
              <button
                onClick={closeAndResetModal}
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
                  disabled={isPending}
                  className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                >
                  <option value="">Select a crisis...</option>
                  {crises.map((c) => (
                    <option key={c.id} value={c.id}>{c.name || c.type}</option>
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
                  disabled={isPending}
                  placeholder="e.g., Stay Indoors Advisory"
                  className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
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
                  disabled={isPending}
                  placeholder="Write your announcement here..."
                  className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none disabled:opacity-50"
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
                      disabled={isPending}
                      onClick={() => setForm({ ...form, priority: p })}
                      className={`flex-1 text-sm font-medium py-2 rounded-lg border transition-colors capitalize ${
                        form.priority === p
                          ? p === "high"
                            ? "bg-destructive/10 border-destructive text-destructive"
                            : "bg-[#00C48C]/10 border-[#00C48C] text-[#00C48C]"
                          : "border-border text-muted-foreground hover:bg-accent disabled:opacity-50"
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
                  ✅ Announcement {editId ? "updated" : "posted"} successfully!
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeAndResetModal}
                  disabled={isPending}
                  className="flex-1 text-sm font-medium py-2.5 rounded-lg border border-border text-foreground hover:bg-accent transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 text-sm font-semibold py-2.5 rounded-lg bg-[#00C48C] hover:bg-[#00a876] text-white transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {isPending ? (editId ? "Updating..." : "Posting...") : (editId ? "Update Announcement" : "Post Announcement")}
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
                disabled={isPending}
                className="flex-1 text-sm font-medium py-2.5 rounded-lg border border-border text-foreground hover:bg-accent transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={isPending}
                className="flex-1 text-sm font-semibold py-2.5 rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-colors disabled:opacity-50"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}