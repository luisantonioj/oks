// app/(protected)/office/crises/[id]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { Crisis } from "@/components/crisis/crisis.types";
import { initialCrises } from "@/components/crisis/crisis.data";
import { SeverityBadge, StatusBadge, formatDateTime } from "@/components/crisis/CrisisBadges";
import {
  CrisisSurveySection,
  CrisisHelpRequestsSection,
  CrisisAnnouncementsSection,
  CrisisProgressSection,
  CrisisDonationsSection,
  CrisisVolunteerSection,
} from "@/components/crisis/CrisisDetailSections";

export default async function CrisisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const crisis = initialCrises.find((c) => c.id === id);

  if (!crisis) notFound();

  const { features } = crisis;

  return (
    <div className="min-h-screen bg-background">

      {/* Top Bar */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/office/crises"
            className="text-sm text-muted-foreground hover:text-[#00C48C] transition-colors flex items-center gap-1 mb-3"
          >
            ← Back to Crisis List
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-foreground">{crisis.name}</h1>
                <StatusBadge status={crisis.status} />
                <span className="text-xs bg-[#00C48C]/10 text-[#00C48C] font-semibold px-2.5 py-0.5 rounded-full">
                  {crisis.type}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Last updated: {formatDateTime(crisis.updated_at)}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/office/crises"
                className="text-sm bg-muted hover:bg-accent text-foreground font-medium px-4 py-2 rounded-lg border border-border transition-colors"
              >
                ✏️ Edit
              </Link>
              {crisis.status === "active" && (
                <button className="text-sm bg-muted hover:bg-accent text-foreground font-medium px-4 py-2 rounded-lg border border-border transition-colors">
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Overview + Affected Areas */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-foreground">Crisis Overview</h2>
              <SeverityBadge severity={crisis.severity} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{crisis.description}</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-bold text-foreground mb-3">Affected Areas</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {crisis.affected_areas.map((area) => (
                <span key={area} className="text-sm bg-[#00C48C]/10 text-[#00C48C] font-medium px-3 py-1 rounded-full">
                  {area}
                </span>
              ))}
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Students at risk:{" "}
                <span className="font-bold text-foreground">{crisis.students_at_risk} students</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{crisis.help_requests.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Help Requests</p>
            <p className="text-xs text-destructive font-medium mt-0.5">
              {crisis.help_requests.filter((r) => r.status === "pending").length} pending
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{crisis.volunteers}</p>
            <p className="text-xs text-muted-foreground mt-1">Volunteers</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{crisis.donations_count}</p>
            <p className="text-xs text-muted-foreground mt-1">Donations</p>
          </div>
        </div>

        {/* Feature-gated sections */}
        {features.survey      && <CrisisSurveySection       crisis={crisis} />}
        {features.help_button && <CrisisHelpRequestsSection  crisis={crisis} />}
                                  <CrisisAnnouncementsSection crisis={crisis} />
        {features.progress    && <CrisisProgressSection      crisis={crisis} />}
        {features.donation    && <CrisisDonationsSection />}
        {features.volunteer   && <CrisisVolunteerSection     crisis={crisis} />}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/office/announcements"
            className="inline-flex items-center gap-2 bg-[#00C48C] hover:bg-[#00a876] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            📢 Post Announcement
          </Link>
          {features.progress && (
            <Link
              href="/office/reports"
              className="inline-flex items-center gap-2 bg-muted hover:bg-accent text-foreground text-sm font-semibold px-4 py-2.5 rounded-lg border border-border transition-colors"
            >
              📊 Add Progress Report
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}