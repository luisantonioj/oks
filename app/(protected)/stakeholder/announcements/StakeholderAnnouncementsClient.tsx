// app/(protected)/stakeholder/announcements/StakeholderAnnouncementsClient.tsx
"use client";

import { useState } from "react";
import { Announcement, Crisis } from "@/types/database";

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${priority === "high" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
      {priority}
    </span>
  );
}

interface StakeholderAnnouncementsClientProps {
  initialAnnouncements: Announcement[];
  crises: Crisis[];
}

export default function StakeholderAnnouncementsClient({ initialAnnouncements, crises }: StakeholderAnnouncementsClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCrisis, setFilterCrisis] = useState("all");

  const filtered = filterCrisis === "all"
    ? initialAnnouncements
    : initialAnnouncements.filter((a) => a.crisis_id === filterCrisis);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Official updates from the school during crisis situations
          </p>
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
              // Map DB data dynamically
              const crisisName = crises.find(c => c.id === ann.crisis_id)?.name || 'Unknown Crisis';
              const postedAt = new Date(ann.created_at).toLocaleString("en-PH", {
                month: "short", day: "numeric", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              });

              return (
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
                        <p className="text-xs text-[#00C48C] font-medium mb-1">{crisisName}</p>
                        {expandedId !== ann.id && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{ann.content}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">{postedAt}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {expandedId === ann.id ? "▲ collapse" : "▼ read more"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedId === ann.id && (
                    <div className="px-5 pb-4 border-t border-border">
                      <p className="text-sm text-muted-foreground leading-relaxed mt-3 whitespace-pre-wrap">{ann.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}