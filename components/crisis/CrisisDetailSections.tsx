// components/crisis/CrisisDetailSections.tsx

import Link from "next/link";
import { Crisis } from "./crisis.types";

// ── Survey ──────────────────────────────────────────────────────────────────
export function CrisisSurveySection({ crisis }: { crisis: Crisis }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h2 className="font-bold text-foreground mb-1">Survey</h2>
      <p className="text-xs text-muted-foreground mb-4">
        Gather real-time safety status from stakeholders affected by this crisis.
      </p>
      <div className="bg-muted/40 rounded-xl p-6 text-center border border-border">
        <p className="text-2xl mb-2">📋</p>
        <h3 className="font-bold text-foreground text-base mb-1">Why Your Voice Matters</h3>
        <p className="text-sm text-muted-foreground mb-1">
          Following <span className="font-medium text-foreground">{crisis.name}</span>'s impact on our
          communities, we need your insights to strengthen our response strategies.
        </p>
        <p className="text-xs text-muted-foreground mb-4">This short survey takes less than 3 minutes to complete.</p>
        <div className="text-left max-w-sm mx-auto mb-5">
          <p className="text-xs font-semibold text-foreground mb-2">What you'll be asked:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Your current preparedness level</li>
            <li>• Knowledge of safety protocols</li>
            <li>• Access to emergency supplies</li>
            <li>• Suggestions for improving this app</li>
          </ul>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#00C48C] hover:bg-[#00a876] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
          📋 Take the Survey Now
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>0 responses so far</span>
        <Link href="/office/surveys" className="text-[#00C48C] hover:underline font-medium">
          Manage surveys →
        </Link>
      </div>
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