// app/(protected)/stakeholder/dashboard/page.tsx
import Link from "next/link";
import { getCurrentUserProfile } from "@/lib/queries/user";
import { redirect } from "next/navigation";

export default async function StakeholderDashboard() {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "stakeholder") {
    redirect("/login");
  }

  const name = profile.name ?? "Stakeholder";
  const firstName = name.split(" ")[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

      {/* ── Greeting + SOS ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Good day, {firstName} 👋</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Here's your current situation overview.</p>
        </div>
        <Link href="/stakeholder/help-requests/new">
          <button className="flex items-center gap-2 bg-destructive hover:bg-destructive/90 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all hover:shadow-md">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5L13 12H1L7 1.5Z" fill="white" fillOpacity="0.4" stroke="white" strokeWidth="1.2" />
              <path d="M7 5.5v3M7 10v.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Request Help
          </button>
        </Link>
      </div>

      {/* ── Active Crisis Banner ── */}
      <div className="bg-destructive/10 border border-destructive/20 rounded-2xl px-5 py-4 flex items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L17 15H1L9 2Z" stroke="currentColor" strokeWidth="1.4" className="text-destructive" />
            <path d="M9 7v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-destructive" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-semibold text-destructive">Active Crisis Detected</p>
            <span className="text-[10px] font-semibold bg-destructive text-white px-1.5 py-0.5 rounded-full">Live</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Campus offices are managing an active crisis. Check announcements for the latest updates.
          </p>
        </div>
        <Link
          href="/stakeholder/announcements"
          className="flex-shrink-0 text-xs font-medium text-destructive border border-destructive/30 px-3 py-1.5 rounded-lg hover:bg-destructive/10 transition-colors whitespace-nowrap"
        >
          View →
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Crises", value: "—", icon: "⚡", color: "text-destructive", bg: "bg-destructive/10" },
          { label: "My Requests", value: "—", icon: "🆘", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500/10" },
          { label: "Announcements", value: "—", icon: "📢", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
          { label: "Open Surveys", value: "—", icon: "📋", color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10" },
        ].map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center text-base mb-4`}>
              {card.icon}
            </div>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* ── Bottom Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

        {/* Recent Announcements */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Recent Announcements</p>
              <p className="text-xs text-muted-foreground mt-0.5">Latest from campus offices</p>
            </div>
            <Link href="/stakeholder/announcements" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </Link>
          </div>
          <div className="px-5 py-12 flex flex-col items-center justify-center text-center">
            <div className="text-3xl mb-3">📢</div>
            <p className="text-sm font-medium mb-1">No announcements yet</p>
            <p className="text-xs text-muted-foreground">Office updates will appear here.</p>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <p className="text-sm font-semibold">Quick Actions</p>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {[
                { label: "Request Help", href: "/stakeholder/help-requests/new", icon: "🆘", hover: "hover:bg-destructive/10 hover:border-destructive/25" },
                { label: "Surveys", href: "/stakeholder/surveys", icon: "📋", hover: "hover:bg-green-500/10 hover:border-green-500/25" },
                { label: "Announcements", href: "/stakeholder/announcements", icon: "📢", hover: "hover:bg-blue-500/10 hover:border-blue-500/25" },
                { label: "My Profile", href: "/stakeholder/profile", icon: "👤", hover: "hover:bg-muted" },
              ].map((a) => (
                <Link key={a.label} href={a.href}>
                  <div className={`flex flex-col items-center gap-1.5 py-4 px-2 rounded-xl border border-border text-center transition-all ${a.hover}`}>
                    <span className="text-xl">{a.icon}</span>
                    <span className="text-[11px] font-medium leading-tight">{a.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Profile card */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-semibold text-muted-foreground flex-shrink-0">
                {firstName[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{name}</p>
                <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
              </div>
              <Link href="/stakeholder/profile">
                <button className="text-xs font-medium text-muted-foreground border border-border px-2.5 py-1 rounded-lg hover:bg-accent transition-colors">
                  Edit
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border text-center">
              <div>
                <p className="text-[10px] text-muted-foreground">Community</p>
                <p className="text-xs font-medium mt-0.5 capitalize">{(profile as any).community ?? "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Role</p>
                <p className="text-xs font-medium mt-0.5">Stakeholder</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}