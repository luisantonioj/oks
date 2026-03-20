// app/(protected)/office/dashboard/page.tsx
import { getCurrentUserProfile } from "@/lib/queries/user";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function OfficeDashboard() {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "office") {
    redirect("/login-office");
  }

  const officeName = (profile as any).office_name ?? "Office";
  const name = profile.name ?? "Officer";
  const firstName = name.split(" ")[0];

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo + office name */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-destructive flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5L14 13H2L8 1.5Z" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight hidden sm:block">OKS!</span>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <span className="text-sm font-medium text-muted-foreground hidden sm:block">{officeName}</span>
          </div>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: "Dashboard", href: "/office/dashboard", active: true },
              { label: "Crises", href: "/office/crises", active: false },
              { label: "Help Requests", href: "/office/help-requests", active: false },
              { label: "Announcements", href: "/office/announcements", active: false },
              { label: "Surveys", href: "/office/surveys", active: false },
              { label: "Reports", href: "/office/reports", active: false },
            ].map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  n.active
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Alert indicator */}
            <button className="relative w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M7.5 1.5a5 5 0 00-5 5v2l-1 2h12l-1-2v-2a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.2" />
                <path d="M6 12.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
            </button>
            <ThemeSwitcher />
            {/* Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-semibold text-blue-600 dark:text-blue-400 flex-shrink-0">
                {firstName[0]?.toUpperCase()}
              </div>
              <div className="hidden sm:block leading-none">
                <p className="text-xs font-semibold">{firstName}</p>
                <p className="text-[10px] text-muted-foreground">{officeName}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Header row ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Command Center
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {officeName} · Welcome back, {firstName}
            </p>
          </div>
          {/* Primary actions */}
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Active Crises",
              value: "—",
              sub: "Currently open",
              icon: "⚡",
              iconBg: "bg-destructive/10",
              valueColor: "text-destructive",
              href: "/office/crises",
            },
            {
              label: "Pending SOS",
              value: "—",
              sub: "Need response",
              icon: "🆘",
              iconBg: "bg-yellow-500/10",
              valueColor: "text-yellow-600 dark:text-yellow-400",
              href: "/office/help-requests",
            },
            {
              label: "Volunteers",
              value: "—",
              sub: "Registered",
              icon: "🤝",
              iconBg: "bg-green-500/10",
              valueColor: "text-green-600 dark:text-green-400",
              href: "/office/dashboard",
            },
            {
              label: "Donations",
              value: "—",
              sub: "Total pledges",
              icon: "📦",
              iconBg: "bg-blue-500/10",
              valueColor: "text-blue-600 dark:text-blue-400",
              href: "/office/dashboard",
            },
          ].map((card) => (
            <Link key={card.label} href={card.href}>
              <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer">
                <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center text-base mb-4`}>
                  {card.icon}
                </div>
                <p className={`text-2xl font-bold ${card.valueColor} mb-0.5`}>{card.value}</p>
                <p className="text-xs font-medium text-foreground">{card.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{card.sub}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* ── Left: SOS Triage ── */}
          <div className="space-y-5">

            {/* SOS Requests */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Help Requests</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Incoming SOS from stakeholders</p>
                </div>
                <Link href="/office/help-requests" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  View all →
                </Link>
              </div>

              {/* Table header */}
              <div className="px-5 py-2.5 grid grid-cols-[1fr_100px_80px_90px] gap-3 border-b border-border bg-muted/30">
                {["Stakeholder", "Location", "Status", "Time"].map((h) => (
                  <p key={h} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                    {h}
                  </p>
                ))}
              </div>

              {/* Empty state */}
              <div className="px-5 py-10 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl mb-3">
                  🆘
                </div>
                <p className="text-sm font-medium mb-1">No pending requests</p>
                <p className="text-xs text-muted-foreground">
                  Incoming help requests will appear here in real-time.
                </p>
              </div>
            </div>

            {/* Active Crises */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Active Crises</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Currently managed incidents</p>
                </div>
                <Link href="/office/crises" className="text-xs font-medium bg-destructive text-white px-3 py-1 rounded-lg hover:bg-destructive/90 transition-colors">
                  + New Crisis
                </Link>
              </div>

              {/* Empty state */}
              <div className="px-5 py-10 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl mb-3">
                  ⚡
                </div>
                <p className="text-sm font-medium mb-1">No active crises</p>
                <p className="text-xs text-muted-foreground">
                  Create a crisis entry when an incident begins.
                </p>
              </div>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-5">

            {/* Office Tools */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold">Office Tools</h2>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { label: "Create Crisis", href: "/office/crises", icon: "⚡", color: "hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive" },
                  { label: "Post Announcement", href: "/office/announcements", icon: "📢", color: "hover:bg-blue-500/10 hover:border-blue-500/30" },
                  { label: "Build Survey", href: "/office/surveys/new", icon: "📋", color: "hover:bg-green-500/10 hover:border-green-500/30" },
                  { label: "Progress Report", href: "/office/reports", icon: "📊", color: "hover:bg-purple-500/10 hover:border-purple-500/30" },
                  { label: "View Volunteers", href: "/office/dashboard", icon: "🤝", color: "hover:bg-yellow-500/10 hover:border-yellow-500/30" },
                ].map((tool) => (
                  <Link key={tool.label} href={tool.href}>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-border transition-all cursor-pointer ${tool.color}`}>
                      <span className="text-base">{tool.icon}</span>
                      <span className="text-sm font-medium">{tool.label}</span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-auto text-muted-foreground">
                        <path d="M3 6h6M6.5 3.5L9 6l-2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-sm font-semibold">Recent Announcements</h2>
                <Link href="/office/announcements" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  View all →
                </Link>
              </div>
              <div className="px-5 py-8 flex flex-col items-center justify-center text-center">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-lg mb-2">
                  📢
                </div>
                <p className="text-xs text-muted-foreground">No announcements posted yet.</p>
              </div>
            </div>

            {/* Office profile card */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                  {firstName[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  Office Staff
                </span>
                <span className="text-[10px] font-medium bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                  {officeName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}