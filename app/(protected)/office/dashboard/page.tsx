// app/(protected)/office/dashboard/page.tsx
import { getCurrentUserProfile } from "@/lib/queries/user";
import { getDashboardStats, getCrisisSummary } from "@/lib/queries/crisis";
import { getAllHelpRequests } from "@/lib/queries/help-request";
import { redirect } from "next/navigation";
import Link from "next/link";
import { EmergencyContactsEditor } from "@/components/emergency-contacts-editor";

// Helper for displaying "5m ago", "2h ago", etc.
function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export default async function OfficeDashboard() {
  const profile = await getCurrentUserProfile();
  
  if (!profile || profile.role !== "office") {
    redirect("/login-office");
  }

  // Fetch all required data concurrently for the dashboard
  const [stats, activeCrisesList, recentRequests] = await Promise.all([
    getDashboardStats(),
    getCrisisSummary(),
    getAllHelpRequests()
  ]);

  // Grab the 5 most recent requests for the preview grid
  const topRequests = recentRequests.slice(0, 5);

  const officeName = (profile as any).office_name ?? "Office";
  const name = profile.name ?? "Officer";
  const firstName = name.split(" ")[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{officeName} · Welcome back, {firstName}</p>
      </div>

      {/* ── Stat Cards: Active Crises | Pending SOS | Volunteers | Donations ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Crises", value: stats.activeCrises.toString(),  icon: "⚡", color: "text-destructive",        bg: "bg-destructive/10",  href: "/office/crises"        },
          { label: "Pending SOS",   value: stats.pendingHelpRequests.toString(), icon: "🆘", color: "text-yellow-600 dark:text-yellow-400",    bg: "bg-yellow-500/10",   href: "/office/help-requests" },
          { label: "Volunteers",    value: stats.totalVolunteers.toString(), icon: "🤝", color: "text-green-600 dark:text-green-400",      bg: "bg-green-500/10",    href: "/office/dashboard"     },
          { label: "Donations",     value: stats.totalDonations.toString(), icon: "📦", color: "text-blue-600 dark:text-blue-400",        bg: "bg-blue-500/10",     href: "/office/dashboard"     },
        ].map((card) => (
          <Link key={card.label} href={card.href}>
            <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer">
              <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center text-base mb-4`}>
                {card.icon}
              </div>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Emergency Contacts — editable by office staff ── */}
      <EmergencyContactsEditor />

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">

        {/* Left */}
        <div className="space-y-4">

          {/* Help Requests */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Help Requests</p>
                <p className="text-xs text-muted-foreground mt-0.5">Incoming SOS from stakeholders</p>
              </div>
              <Link href="/office/help-requests" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                View all →
              </Link>
            </div>
            <div className="px-5 py-2.5 grid grid-cols-[1fr_120px_80px_70px] gap-3 border-b border-border bg-muted/30">
              {["Stakeholder", "Location", "Status", "Time"].map((h) => (
                <p key={h} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{h}</p>
              ))}
            </div>
            <div className="divide-y divide-border">
              {topRequests.length === 0 ? (
                <div className="px-5 py-6 text-sm text-center text-muted-foreground">
                  No recent help requests.
                </div>
              ) : (
                topRequests.map((req) => (
                  <div key={req.id} className="px-5 py-3 grid grid-cols-[1fr_120px_80px_70px] gap-3 items-center hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 ${req.status === "pending" ? "bg-destructive" : "bg-muted-foreground"}`}>
                        {/* Using an initial as a placeholder until stakeholder profile join is added */}
                        U
                      </div>
                      <p className="text-xs font-semibold truncate">User {req.id.slice(0,4).toUpperCase()}</p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{req.location || "Location not provided"}</p>
                    <span className={`text-[10px] capitalize font-semibold px-2 py-1 rounded-full w-fit ${
                      req.status === "pending"
                        ? "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400"
                        : "bg-green-500/15 text-green-700 dark:text-green-400"
                    }`}>
                      {req.status}
                    </span>
                    <p className="text-[10px] text-muted-foreground">{getRelativeTime(req.created_at)}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Crises */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Active Crises</p>
                <p className="text-xs text-muted-foreground mt-0.5">Currently managed incidents</p>
              </div>
              <Link href="/office/crises" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                View all →
              </Link>
            </div>
            <div className="divide-y divide-border">
              {activeCrisesList.length === 0 ? (
                <div className="px-5 py-6 text-sm text-center text-muted-foreground">
                  No active crises at the moment.
                </div>
              ) : (
                activeCrisesList.map((c) => (
                  <div key={c.id} className="px-5 py-4 flex items-start gap-3 hover:bg-muted/20 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm">⚡</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm capitalize font-semibold">{c.type}</p>
                        {c.severity && (
                          <span className={`text-[10px] capitalize font-semibold px-1.5 py-0.5 rounded-full ${
                            c.severity === "high" ? "bg-destructive/15 text-destructive" : "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400"
                          }`}>
                            {c.severity}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{c.name || c.summary}</p>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span>📍 {c.affected_areas || 'System Wide'}</span>
                        <span>· {getRelativeTime(c.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right — profile card + today's summary */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">
                {firstName[0]?.toUpperCase() || "O"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{name}</p>
                <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
              </div>
              <Link href="/office/profile">
                <button className="text-xs font-medium text-muted-foreground border border-border px-2.5 py-1 rounded-lg hover:bg-accent transition-colors">
                  Edit
                </button>
              </Link>
            </div>
            <div className="flex gap-1.5 mb-4">
              <span className="text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                Office Staff
              </span>
              <span className="text-[10px] font-medium bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full truncate">
                {officeName}
              </span>
            </div>
            <div className="pt-4 border-t border-border space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Global System Stats</p>
              {[
                { label: "Total Crises Tracked",   value: stats.totalCrises.toString() },
                { label: "Total Requests Made",    value: stats.totalHelpRequests.toString() },
                { label: "Active Pending SOS",     value: stats.pendingHelpRequests.toString() },
                { label: "Registered Volunteers",  value: stats.totalVolunteers.toString() },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xs font-semibold">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}