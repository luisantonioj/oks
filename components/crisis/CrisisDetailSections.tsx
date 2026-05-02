// components/crisis/CrisisDetailSections.tsx

import Link from "next/link";
import { Crisis } from "./crisis.types";
import { ClipboardList, ShieldAlert, HeartHandshake, Users, Lock, ChevronRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
        <h2 className="font-bold text-foreground">Help Requests</h2>
        <Link href="/office/help-requests" className="text-xs text-[#00C48C] hover:underline font-medium">
          View all →
        </Link>
      </div>
      {crisis.help_requests.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No help requests yet.</p>
      ) : (
        <div className="space-y-3">
          {crisis.help_requests.map((req) => (
            <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
              <div>
                <p className="text-sm font-semibold text-foreground">{req.name}</p>
                <p className="text-xs text-muted-foreground">{req.location}</p>
              </div>
              <div className="text-right">
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
export function CrisisDonationsSection() {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h2 className="font-bold text-foreground mb-4">Donations</h2>
      <div className="grid grid-cols-3 gap-4 mb-3">
        {[
          { icon: "💰", label: "Total Funds Raised", value: "₱0" },
          { icon: "🥫", label: "Total Food Raised",  value: "0 kg" },
          { icon: "📦", label: "Other Consumables",  value: "0 kg" },
        ].map((d) => (
          <div key={d.label} className="bg-muted/40 rounded-xl p-4 text-center border border-border">
            <p className="text-2xl mb-1">{d.icon}</p>
            <p className="text-lg font-bold text-foreground">{d.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{d.label}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center">Updated in real-time</p>
    </div>
  );
}

// ── Volunteer ────────────────────────────────────────────────────────────────
export function CrisisVolunteerSection({ crisis }: { crisis: Crisis }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h2 className="font-bold text-foreground mb-1">Volunteer Coordination</h2>
      <p className="text-xs text-muted-foreground mb-4">Coordinating relief efforts and volunteer deployment</p>
      <div className="bg-muted/40 rounded-xl p-5 border border-border">
        <h3 className="font-semibold text-foreground text-sm mb-3">Volunteer Needs</h3>
        <p className="text-xs font-medium text-muted-foreground mb-2">Expected volunteer work:</p>
        <ul className="text-xs text-muted-foreground space-y-1 mb-5">
          <li>• Distributing food, water, and clothing</li>
          <li>• Providing emotional support and psychological first aid</li>
          <li>• Loading and unloading supplies</li>
          <li>• Cleaning up debris or damaged areas</li>
          <li>• Packing emergency kits and supplies</li>
          <li>• Conducting wellness checks on vulnerable individuals</li>
        </ul>
        <button className="inline-flex items-center gap-2 bg-[#00C48C] hover:bg-[#00a876] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
          🙋 Sign up to Volunteer
        </button>
      </div>
      <div className="mt-3 text-xs text-muted-foreground text-right">
        {crisis.volunteers} volunteer{crisis.volunteers !== 1 ? "s" : ""} registered
      </div>
    </div>
  );
}