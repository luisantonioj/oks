// app/portal/dashboard/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { adminSignOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function AdminDashboard() {
  // Verify admin cookie — UNCHANGED
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("oks_admin_session")?.value;

  if (adminSession !== "authenticated") {
    redirect("/login-portal");
  }

  const adminName = process.env.ADMIN_NAME || "Administrator";
  const firstName = adminName.split(" ")[0];

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo + admin badge */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-destructive flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5L14 13H2L8 1.5Z" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight">OKS!</span>
            <div className="w-px h-4 bg-border" />
            <span className="text-xs font-medium bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full">
              System Admin
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: "Dashboard", href: "/portal/dashboard", active: true },
              { label: "Offices", href: "/portal/offices", active: false },
              { label: "Stakeholders", href: "/portal/stakeholders", active: false },
              { label: "Settings", href: "/portal/settings", active: false },
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

          {/* Right: theme + avatar + logout */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold text-muted-foreground">
                {firstName[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-medium hidden sm:block">{firstName}</span>
            </div>
            <form action={adminSignOut}>
              <button
                type="submit"
                className="text-xs font-medium text-muted-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-accent hover:text-foreground transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Heading ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              System Administration
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, {adminName}. Full platform oversight.
            </p>
          </div>
          <Link href="/portal/create-office">
            <button className="text-sm font-semibold bg-foreground text-background px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
              + New Office Account
            </button>
          </Link>
        </div>

        {/* ── Warning banner ── */}
        <div className="bg-destructive/10 border border-destructive/25 rounded-2xl px-5 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5L13 12H1L7 1.5Z" stroke="currentColor" strokeWidth="1.3" className="text-destructive" />
              <path d="M7 5.5v3M7 10v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="text-destructive" />
            </svg>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-destructive">Admin session active.</span>{" "}
            All actions performed here are logged for audit and accountability.
            Do not share your credentials.
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Offices",
              value: "—",
              sub: "Registered offices",
              icon: "🏢",
              iconBg: "bg-blue-500/10",
              valueColor: "text-blue-600 dark:text-blue-400",
            },
            {
              label: "Stakeholders",
              value: "—",
              sub: "Registered users",
              icon: "👥",
              iconBg: "bg-green-500/10",
              valueColor: "text-green-600 dark:text-green-400",
            },
            {
              label: "Total Crises",
              value: "—",
              sub: "All time",
              icon: "⚡",
              iconBg: "bg-destructive/10",
              valueColor: "text-destructive",
            },
            {
              label: "Active Crises",
              value: "—",
              sub: "Currently open",
              icon: "🚨",
              iconBg: "bg-yellow-500/10",
              valueColor: "text-yellow-600 dark:text-yellow-400",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-card border border-border rounded-2xl p-5"
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

        {/* ── Two Column ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

          {/* ── Left: Admin Actions Grid ── */}
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold">Management Areas</h2>
                <p className="text-xs text-muted-foreground mt-0.5">System-wide controls and oversight tools</p>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    title: "Create Office Account",
                    desc: "Register a new office staff member to the system.",
                    icon: "➕",
                    href: "/portal/create-office",
                    color: "hover:border-blue-500/30 hover:bg-blue-500/5",
                  },
                  {
                    title: "Manage Offices",
                    desc: "View, update, or remove office accounts.",
                    icon: "🏢",
                    href: "/portal/offices",
                    color: "hover:border-green-500/30 hover:bg-green-500/5",
                  },
                  {
                    title: "Manage Stakeholders",
                    desc: "View and manage registered student and faculty accounts.",
                    icon: "👥",
                    href: "/portal/stakeholders",
                    color: "hover:border-purple-500/30 hover:bg-purple-500/5",
                  },
                  {
                    title: "System Settings",
                    desc: "Configure global system parameters and access controls.",
                    icon: "⚙️",
                    href: "/portal/settings",
                    color: "hover:border-muted-foreground/30 hover:bg-muted/60",
                  },
                ].map((item) => (
                  <Link key={item.title} href={item.href}>
                    <div className={`group flex items-start gap-4 p-4 rounded-xl border border-border transition-all cursor-pointer ${item.color}`}>
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold group-hover:text-foreground transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Offices table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Office Accounts</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">All registered office staff</p>
                </div>
                <Link href="/portal/create-office" className="text-xs font-medium text-muted-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
                  + Add Office
                </Link>
              </div>

              {/* Table head */}
              <div className="px-5 py-2.5 grid grid-cols-[1fr_120px_90px] gap-3 border-b border-border bg-muted/30">
                {["Name / Office", "Email", "Status"].map((h) => (
                  <p key={h} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                    {h}
                  </p>
                ))}
              </div>

              {/* Empty state */}
              <div className="px-5 py-10 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl mb-3">
                  🏢
                </div>
                <p className="text-sm font-medium mb-1">No office accounts yet</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Create your first office account to get started.
                </p>
                <Link href="/portal/create-office">
                  <button className="text-xs font-semibold bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                    Create Office Account
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* ── Right: Info sidebar ── */}
          <div className="space-y-5">

            {/* System Status */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold">System Status</h2>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { label: "Authentication", status: "Operational", ok: true },
                  { label: "Database", status: "Operational", ok: true },
                  { label: "File Storage", status: "Operational", ok: true },
                  { label: "Real-time Updates", status: "Operational", ok: true },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${s.ok ? "bg-green-500" : "bg-destructive"}`} />
                      <span className={`text-[10px] font-medium ${s.ok ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit log placeholder */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold">Recent Activity</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Audit log</p>
              </div>
              <div className="px-5 py-8 flex flex-col items-center justify-center text-center">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-lg mb-2">
                  📋
                </div>
                <p className="text-xs text-muted-foreground">No recent activity logged.</p>
              </div>
            </div>

            {/* Admin card */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {firstName[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{adminName}</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {process.env.ADMIN_EMAIL ?? "admin@dlsl.edu.ph"}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-medium bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                System Administrator
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}