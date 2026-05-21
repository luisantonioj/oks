// components/crisis/CrisisDetailSections.tsx

import Link from "next/link";
import { Crisis } from "./crisis.types";
import { ClipboardList, ShieldAlert, HeartHandshake, Users, Lock, ChevronRight, Plus, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DonationResponseEntry } from "@/lib/queries/survey";

export interface VolunteerResponseEntry {
  id: string;
  survey_id: string;
  stakeholder_id: string;
  stakeholder_name: string;
  answers: Record<string, string | string[]>;
  created_at: string;
  questions: { id: string; text: string; type: string; options?: string[] }[];
}

const surveyTypeConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  safety: {
    label: "Safety", icon: <ShieldAlert className="h-3 w-3" />, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/20", border: "border-orange-300 dark:border-orange-800",
  },
  donation: {
    label: "Donation", icon: <HeartHandshake className="h-3 w-3" />, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-950/20", border: "border-pink-300 dark:border-pink-800",
  },
  volunteer: {
    label: "Volunteer", icon: <Users className="h-3 w-3" />, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/20", border: "border-green-300 dark:border-green-800",
  },
};

// ── Survey ──────────────────────────────────────────────────────────────────
export function CrisisSurveySection({ crisis, surveys = [] }: { crisis: Crisis; surveys?: any[] }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold text-foreground">Linked Surveys</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Surveys actively collecting data for this crisis.</p>
        </div>
        <Link href={`/office/surveys/new?crisis_id=${crisis.id}`} className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary hover:bg-primary/20 font-semibold px-3 py-1.5 rounded-lg transition-colors">
          <Plus className="h-3.5 w-3.5" /> New Survey
        </Link>
      </div>

      {surveys.length === 0 ? (
        <div className="bg-muted/40 rounded-xl p-6 text-center border border-border">
          <ClipboardList className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">No surveys linked yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Create a survey to start gathering data.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {surveys.map((survey) => {
            const isActive = survey.status === "active";
            const typeStyle = survey.survey_type ? surveyTypeConfig[survey.survey_type] : null;

            return (
              <Link key={survey.id} href={`/office/surveys/${survey.id}`} className="block group">
                <div className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-muted/30 hover:border-primary/30 hover:bg-accent/50 transition-all duration-200">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${isActive ? "bg-blue-100 dark:bg-blue-950/40 text-blue-600" : "bg-muted text-muted-foreground"}`}>
                      <ClipboardList className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {survey.title}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        <Badge variant="outline" className={isActive ? "border-blue-400 text-blue-600 bg-blue-50 dark:bg-blue-950/20 text-[10px] px-1.5 py-0" : "text-[10px] px-1.5 py-0 text-muted-foreground"}>
                          {isActive ? (
                            <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />Active</span>
                          ) : (
                            <span className="flex items-center gap-1"><Lock className="h-2.5 w-2.5" /> Closed</span>
                          )}
                        </Badge>
                        {typeStyle && (
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 gap-1 ${typeStyle.color} ${typeStyle.bg} ${typeStyle.border}`}>
                            {typeStyle.icon}
                            {typeStyle.label}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Help Requests ────────────────────────────────────────────────────────────
export function CrisisHelpRequestsSection({ crisis }: { crisis: Crisis }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold text-foreground">Help Requests</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {crisis.help_requests.length} request{crisis.help_requests.length !== 1 ? "s" : ""} linked to this crisis
          </p>
        </div>
        <Link href="/office/help-requests" className="text-xs text-[#00C48C] hover:underline font-medium">
          View all →
        </Link>
      </div>
      {crisis.help_requests.length === 0 ? (
        <div className="bg-muted/40 rounded-xl p-6 text-center border border-border">
          <p className="text-sm font-medium text-muted-foreground">No help requests yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Help requests submitted for this crisis will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {crisis.help_requests.map((req) => (
            <Link key={req.id} href={`/office/inbox/${req.id}`} className="block group">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/30 hover:bg-accent/50 transition-all duration-200">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{req.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{req.location}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    req.status === "pending"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-[#00C48C]/10 text-[#00C48C]"
                  }`}>
                    {req.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">{req.time}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Announcements ────────────────────────────────────────────────────────────
export function CrisisAnnouncementsSection({ crisis }: { crisis: Crisis }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-foreground">Announcements</h2>
        <Link href="/office/announcements" className="text-xs text-[#00C48C] hover:underline font-medium">
          Manage announcements →
        </Link>
      </div>
      {crisis.announcements.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No announcements yet.</p>
      ) : (
        <div className="space-y-3">
          {crisis.announcements.map((ann) => (
            <div key={ann.id} className="p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-foreground">{ann.title}</p>
                <p className="text-xs text-muted-foreground shrink-0 ml-4">{ann.posted_at}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{ann.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Progress ─────────────────────────────────────────────────────────────────
export function CrisisProgressSection({ crisis }: { crisis: Crisis }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-foreground">Crisis Progress</h2>
        <Link href="/office/reports" className="text-xs text-[#00C48C] hover:underline font-medium">
          View full reports →
        </Link>
      </div>
      {crisis.progress_updates.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No updates yet.</p>
      ) : (
        <div className="space-y-3">
          {crisis.progress_updates.map((update) => (
            <div key={update.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <span className="text-xl leading-none">{update.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{update.title}</p>
                  <p className="text-xs text-muted-foreground shrink-0 ml-4">{update.time}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{update.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Donations ────────────────────────────────────────────────────────────────
export function CrisisDonationsSection({
  donationResponses = [],
}: {
  donationResponses?: DonationResponseEntry[];
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-foreground">Donation Pledges</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Survey responses from stakeholders pledging donations</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">{donationResponses.length}</p>
          <p className="text-xs text-muted-foreground">pledge{donationResponses.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
      {donationResponses.length === 0 ? (
        <div className="bg-muted/40 rounded-xl p-6 text-center border border-border">
          <HeartHandshake className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">No donation pledges yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Pledges will appear here once stakeholders complete the donation survey.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {donationResponses.map((r) => (
            <div key={r.id} className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-950/40 flex items-center justify-center flex-shrink-0">
                    <HeartHandshake className="h-4 w-4 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{r.stakeholder_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString("en-PH", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-pink-700 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-800 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" />Pledged
                </span>
              </div>
              {r.questions.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-10">
                  {r.questions.map((q) => {
                    const ans = r.answers[q.id];
                    if (!ans || (Array.isArray(ans) && ans.length === 0)) return null;
                    return (
                      <div key={q.id} className="text-xs">
                        <p className="font-medium text-muted-foreground mb-0.5">{q.text}</p>
                        <p className="text-foreground">{Array.isArray(ans) ? ans.join(", ") : ans}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Volunteer ────────────────────────────────────────────────────────────────
export function CrisisVolunteerSection({
  crisis,
  volunteerResponses = [],
}: {
  crisis: Crisis;
  volunteerResponses?: VolunteerResponseEntry[];
}) {
  const willing = volunteerResponses.filter((r) => {
    const q1 = r.questions[0];
    if (!q1) return false;
    const ans = r.answers[q1.id];
    return ans === "Yes" || (Array.isArray(ans) && ans.includes("Yes"));
  });
  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-foreground">Volunteer Coordination</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Survey responses from registered volunteers</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">{willing.length}</p>
          <p className="text-xs text-muted-foreground">willing volunteer{willing.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
      {volunteerResponses.length === 0 ? (
        <div className="bg-muted/40 rounded-xl p-6 text-center border border-border">
          <Users className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">No volunteer responses yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Responses will appear here once stakeholders complete the volunteer survey.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {volunteerResponses.map((r) => {
            const q1 = r.questions[0];
            const isWilling = q1
              ? r.answers[q1.id] === "Yes" || (Array.isArray(r.answers[q1.id]) && (r.answers[q1.id] as string[]).includes("Yes"))
              : false;

            return (
              <div key={r.id} className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center flex-shrink-0">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{r.stakeholder_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleString("en-PH", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  {isWilling ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" />Willing
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full">
                      <XCircle className="h-3 w-3" />Not willing
                    </span>
                  )}
                </div>

                {isWilling && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-10">
                    {r.questions.slice(1).map((q) => {
                      const ans = r.answers[q.id];
                      if (!ans || (Array.isArray(ans) && ans.length === 0)) return null;
                      return (
                        <div key={q.id} className="text-xs">
                          <p className="font-medium text-muted-foreground mb-0.5">{q.text}</p>
                          <p className="text-foreground">
                            {Array.isArray(ans) ? ans.join(", ") : ans}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}