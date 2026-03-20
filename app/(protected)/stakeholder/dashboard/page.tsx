// app/(protected)/stakeholder/dashboard/page.tsx
import React from "react";
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
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="w-full px-6 h-14 flex items-center justify-between">

          {/* Left: Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-destructive flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 13H2L8 2Z" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight">OKS!</span>
          </div>

          {/* Center: Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "Dashboard", href: "/stakeholder/dashboard", active: true },
              { label: "Announcements", href: "/stakeholder/announcements", active: false },
              { label: "Surveys", href: "/stakeholder/surveys", active: false },
              { label: "My Requests", href: "/stakeholder/help-requests", active: false },
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

          {/* Right: Bell + Avatar */}
          <div className="flex items-center gap-3">
            <button className="relative w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M7.5 1.5a5 5 0 00-5 5v2l-1 2h12l-1-2v-2a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.2" />
                <path d="M6 12.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
            </button>
            <Link href="/stakeholder/profile">
              <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold text-muted-foreground hover:border-muted-foreground/40 transition-colors">
                {firstName[0]?.toUpperCase()}
              </div>
            </Link>
          </div>

        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="w-full px-6 py-8 space-y-8">

        {/* ── Greeting ── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Good day, {firstName} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Stay informed and safe. Here's your current situation overview.
            </p>
          </div>
          <Link href="/stakeholder/help-requests/new">
            <button className="flex items-center gap-2 bg-destructive hover:bg-destructive/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L13 12H1L7 1.5Z" stroke="white" strokeWidth="1.2" fill="white" fillOpacity="0.3" />
                <path d="M7 5.5v3M7 10v.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Request Help
            </button>
          </Link>
        </div>

        {/* ── Active Crisis Banner ── */}
        <div className="bg-destructive/10 border border-destructive/25 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L17 15H1L9 2Z" stroke="currentColor" strokeWidth="1.4" className="text-destructive" />
                <path d="M9 7v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-destructive" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-destructive">Active Crisis Detected</p>
                <span className="text-[10px] font-medium bg-destructive text-white px-2 py-0.5 rounded-full">
                  Live
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your campus offices are currently managing an active crisis. Check announcements
                for the latest updates and follow official instructions.
              </p>
            </div>
            <Link
              href="/stakeholder/announcements"
              className="flex-shrink-0 text-xs font-medium text-destructive hover:text-destructive/80 transition-colors border border-destructive/30 px-3 py-1.5 rounded-lg hover:bg-destructive/10 whitespace-nowrap"
            >
              View Updates →
            </Link>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Active Crises",
              value: "—",
              sub: "Campus-wide",
              icon: "⚡",
              iconBg: "bg-destructive/10",
              valueColor: "text-destructive",
            },
            {
              label: "My Requests",
              value: "—",
              sub: "Submitted",
              icon: "🆘",
              iconBg: "bg-yellow-500/10",
              valueColor: "text-yellow-600 dark:text-yellow-400",
            },
            {
              label: "New Announcements",
              value: "—",
              sub: "Unread",
              icon: "📢",
              iconBg: "bg-blue-500/10",
              valueColor: "text-blue-600 dark:text-blue-400",
            },
            {
              label: "Open Surveys",
              value: "—",
              sub: "Pending response",
              icon: "📋",
              iconBg: "bg-green-500/10",
              valueColor: "text-green-600 dark:text-green-400",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-card border border-border rounded-2xl p-5 hover:shadow-sm transition-shadow"
            >
              <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center text-base mb-4`}>
                {card.icon}
              </div>
              <p className={`text-2xl font-bold ${card.valueColor} mb-0.5`}>{card.value}</p>
              <p className="text-xs font-medium text-foreground">{card.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

          {/* ── Recent Announcements ── */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Recent Announcements</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Latest from campus offices</p>
              </div>
              <Link
                href="/stakeholder/announcements"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="px-5 py-10 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl mb-3">
                📢
              </div>
              <p className="text-sm font-medium mb-1">No announcements yet</p>
              <p className="text-xs text-muted-foreground">
                When offices post updates, they'll appear here.
              </p>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-5">

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold">Quick Actions</h2>
              </div>
              <div className="p-3 grid grid-cols-2 gap-2">
                {[
                  { label: "Request Help", href: "/stakeholder/help-requests/new", icon: "🆘", color: "hover:bg-destructive/10 hover:border-destructive/30" },
                  { label: "View Surveys", href: "/stakeholder/surveys", icon: "📋", color: "hover:bg-green-500/10 hover:border-green-500/30" },
                  { label: "Announcements", href: "/stakeholder/announcements", icon: "📢", color: "hover:bg-blue-500/10 hover:border-blue-500/30" },
                  { label: "My Profile", href: "/stakeholder/profile", icon: "👤", color: "hover:bg-muted hover:border-muted-foreground/20" },
                ].map((a) => (
                  <Link key={a.label} href={a.href}>
                    <div className={`flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-xl border border-border text-center transition-all ${a.color} cursor-pointer`}>
                      <span className="text-xl">{a.icon}</span>
                      <span className="text-xs font-medium leading-tight">{a.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* My Help Requests */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-sm font-semibold">My Help Requests</h2>
                <Link href="/stakeholder/help-requests" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  View all →
                </Link>
              </div>
              <div className="px-5 py-8 flex flex-col items-center justify-center text-center">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-lg mb-2">
                  🆘
                </div>
                <p className="text-xs text-muted-foreground">No requests submitted yet.</p>
              </div>
            </div>

            {/* Profile snippet */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-semibold text-muted-foreground flex-shrink-0">
                  {firstName[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{name}</p>
                  <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
                </div>
                <Link href="/stakeholder/profile">
                  <button className="text-xs font-medium text-muted-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
                    Edit
                  </button>
                </Link>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Community</p>
                    <p className="text-xs font-medium mt-0.5 capitalize">
                      {(profile as any).community ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="text-xs font-medium mt-0.5 capitalize">Stakeholder</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}