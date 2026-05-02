// app/(protected)/office/crises/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crisis } from "@/components/crisis/crisis.types";
import { getCrisisById } from "@/lib/queries/crisis";
import { getAnnouncements } from "@/lib/queries/announcement";        
import { SeverityBadge, StatusBadge, formatDateTime } from "@/components/crisis/CrisisBadges";
import {
  CrisisSurveySection, CrisisHelpRequestsSection, CrisisAnnouncementsSection,
  CrisisProgressSection, CrisisDonationsSection, CrisisVolunteerSection,
} from "@/components/crisis/CrisisDetailSections";
import { CrisisDetailActionsClient } from "@/components/crisis/CrisisDetailActionsClient"; // ← issue 6

export default async function CrisisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rawCrisis = await getCrisisById(id);
  if (!rawCrisis) notFound();

  const crisis = rawCrisis as unknown as Crisis;
  const features = crisis.features || {};

  const dbAnnouncements = await getAnnouncements(id);
  const announcements = dbAnnouncements.map((ann) => ({
    id: ann.id,
    title: ann.title,
    content: ann.content,
    posted_at: new Date(ann.created_at).toLocaleString("en-PH", {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit",
    }),
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/office/crises"
            className="text-sm text-muted-foreground hover:text-[#00C48C] transition-colors flex items-center gap-1 mb-3"
          >← Back to Crisis List</Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-foreground">{crisis.name}</h1>
                <StatusBadge status={crisis.status} />
                <span className="text-xs bg-[#00C48C]/10 text-[#00C48C] font-semibold px-2.5 py-0.5 rounded-full">
                  {crisis.type}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Last updated: {crisis.updated_at ? formatDateTime(crisis.updated_at) : "N/A"}
              </p>
            </div>
            {/* Issue 6: replaced static buttons with working client component */}
            <div className="flex items-center gap-2 shrink-0">
              <CrisisDetailActionsClient
                id={rawCrisis.id}
                name={rawCrisis.name}
                type={rawCrisis.type}
                summary={rawCrisis.summary ?? ""}
                affected_areas={rawCrisis.affected_areas ?? []}
                severity={rawCrisis.severity ?? "medium"}
                required_actions={rawCrisis.required_actions ?? ""}
                status={rawCrisis.status ?? "active"}
                features={rawCrisis.features}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-foreground">Crisis Overview</h2>
              <SeverityBadge severity={crisis.severity} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{crisis.summary}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-bold text-foreground mb-3">Affected Areas</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {crisis.affected_areas?.map((area) => (
                <span key={area} className="text-sm bg-[#00C48C]/10 text-[#00C48C] font-medium px-3 py-1 rounded-full">{area}</span>
              ))}
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Students at risk: <span className="font-bold text-foreground">{crisis.students_at_risk || 0} students</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{crisis.help_requests?.length || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Help Requests</p>
            <p className="text-xs text-destructive font-medium mt-0.5">
              {crisis.help_requests?.filter((r) => r.status === "pending").length || 0} pending
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{crisis.volunteers || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Volunteers</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{crisis.donations_count || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Donations</p>
          </div>
        </div>

        {features.survey      && <CrisisSurveySection crisis={crisis} />}
        {features.help_button && <CrisisHelpRequestsSection crisis={{ ...crisis, help_requests: crisis.help_requests || [] }} />}
        {/* Issue 7: pass real DB announcements */}
        <CrisisAnnouncementsSection crisis={{ ...crisis, announcements }} />
        {features.progress    && <CrisisProgressSection crisis={{ ...crisis, progress_updates: crisis.progress_updates || [] }} />}
        {features.donation    && <CrisisDonationsSection />}
        {features.volunteer   && <CrisisVolunteerSection crisis={crisis} />}

        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/office/announcements"
            className="inline-flex items-center gap-2 bg-[#00C48C] hover:bg-[#00a876] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >📢 Post Announcement</Link>
          {features.progress && (
            <Link href="/office/reports"
              className="inline-flex items-center gap-2 bg-muted hover:bg-accent text-foreground text-sm font-semibold px-4 py-2.5 rounded-lg border border-border transition-colors"
            >📊 Add Progress Report</Link>
          )}
        </div>
      </div>
    </div>
  );
}