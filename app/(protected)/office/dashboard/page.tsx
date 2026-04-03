// app/(protected)/office/dashboard/page.tsx
import { getCurrentUserProfile } from "@/lib/queries/user";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OfficeDashboard() {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "office") {
    redirect("/login-office");
  }

  const officeName = (profile as any).office_name ?? "Office";
  const name = profile.name ?? "Officer";
  const firstName = name.split(" ")[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{officeName} · Welcome back, {firstName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/office/crises">
            <button className="text-sm font-medium border border-border px-4 py-2 rounded-xl hover:bg-accent transition-colors">
              Manage Crises
            </button>
          </Link>
          <Link href="/office/announcements">
            <button className="text-sm font-semibold bg-foreground text-background px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
              + Announcement
            </button>
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Crises", value: "—", icon: "⚡", color: "text-destructive", bg: "bg-destructive/10", href: "/office/crises" },
          { label: "Pending SOS", value: "—", icon: "🆘", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500/10", href: "/office/help-requests" },
          { label: "Volunteers", value: "—", icon: "🤝", color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10", href: "/office/dashboard" },
          { label: "Donations", value: "—", icon: "📦", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", href: "/office/dashboard" },
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
            <div className="px-5 py-2.5 grid grid-cols-[1fr_100px_80px_80px] gap-3 border-b border-border bg-muted/30">
              {["Stakeholder", "Location", "Status", "Time"].map((h) => (
                <p key={h} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{h}</p>
              ))}
            </div>
            <div className="px-5 py-12 flex flex-col items-center justify-center text-center">
              <div className="text-3xl mb-3">🆘</div>
              <p className="text-sm font-medium mb-1">No pending requests</p>
              <p className="text-xs text-muted-foreground">Incoming help requests will appear here.</p>
            </div>
          </div>

          {/* Active Crises */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Active Crises</p>
                <p className="text-xs text-muted-foreground mt-0.5">Currently managed incidents</p>
              </div>
              <Link href="/office/crises">
                <button className="text-xs font-medium bg-destructive text-white px-3 py-1.5 rounded-lg hover:bg-destructive/90 transition-colors">
                  + New Crisis
                </button>
              </Link>
            </div>
            <div className="px-5 py-12 flex flex-col items-center justify-center text-center">
              <div className="text-3xl mb-3">⚡</div>
              <p className="text-sm font-medium mb-1">No active crises</p>
              <p className="text-xs text-muted-foreground">Create a crisis entry when an incident begins.</p>
            </div>
          </div>

        </div>

        {/* Right */}
        <div className="space-y-4">

          {/* Office Tools */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <p className="text-sm font-semibold">Office Tools</p>
            </div>
            <div className="p-3 space-y-1.5">
              {[
                { label: "Create Crisis", href: "/office/crises", icon: "⚡", hover: "hover:bg-destructive/10 hover:border-destructive/25" },
                { label: "Post Announcement", href: "/office/announcements", icon: "📢", hover: "hover:bg-blue-500/10 hover:border-blue-500/25" },
                { label: "Build Survey", href: "/office/surveys/new", icon: "📋", hover: "hover:bg-green-500/10 hover:border-green-500/25" },
                { label: "Progress Report", href: "/office/reports", icon: "📊", hover: "hover:bg-purple-500/10 hover:border-purple-500/25" },
                { label: "View Volunteers", href: "/office/dashboard", icon: "🤝", hover: "hover:bg-yellow-500/10 hover:border-yellow-500/25" },
              ].map((tool) => (
                <Link key={tool.label} href={tool.href}>
                  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border transition-all cursor-pointer ${tool.hover}`}>
                    <span className="text-sm">{tool.icon}</span>
                    <span className="text-xs font-medium flex-1">{tool.label}</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-muted-foreground">
                      <path d="M3 5h4M5.5 3L7 5l-1.5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Office card */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">
                {firstName[0]?.toUpperCase()}
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
            <div className="flex gap-1.5">
              <span className="text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                Office Staff
              </span>
              <span className="text-[10px] font-medium bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full truncate">
                {officeName}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}