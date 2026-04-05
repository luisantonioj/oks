// app/portal/dashboard/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getAllOffices, getAllStakeholders } from "@/lib/queries/user";
import { getDashboardStats } from "@/lib/queries/crisis";

export default async function AdminDashboard() {
  // 1. USE SUPABASE FOR AUTH CHECK
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login-portal");
  }

  const adminName = process.env.ADMIN_NAME || "Administrator";
  const firstName = adminName.split(" ")[0];

  // ── Fetch Real Data from Supabase ──
  const [offices, stakeholders, stats] = await Promise.all([
    getAllOffices(),
    getAllStakeholders(),
    getDashboardStats(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Administration</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back, {adminName}. Full platform oversight.</p>
        </div>
        <Link href="/portal/create-office">
          <button className="text-sm font-semibold bg-foreground text-background px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
            + New Office Account
          </button>
        </Link>
      </div>

      {/* ── Audit notice ── */}
      <div className="bg-destructive/10 border border-destructive/20 rounded-2xl px-5 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5L13 12H1L7 1.5Z" stroke="currentColor" strokeWidth="1.3" className="text-destructive" />
            <path d="M7 5.5v3M7 10v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="text-destructive" />
          </svg>
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-destructive">Admin session active. </span>
          All actions are logged for audit and accountability. Do not share your credentials.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Offices", value: "—", icon: "🏢", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
          { label: "Stakeholders", value: "—", icon: "👥", color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10" },
          { label: "Total Crises", value: "—", icon: "⚡", color: "text-destructive", bg: "bg-destructive/10" },
          { label: "Active Crises", value: "—", icon: "🚨", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500/10" },
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

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">

        {/* Left */}
        <div className="space-y-4">

          {/* Management areas */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <p className="text-sm font-semibold">Management Areas</p>
              <p className="text-xs text-muted-foreground mt-0.5">System-wide controls and oversight tools</p>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "Create Office Account", desc: "Register a new office staff member.", icon: "➕", href: "/portal/create-office", hover: "hover:border-blue-500/30 hover:bg-blue-500/5" },
                { title: "Manage Offices", desc: "View, update, or remove office accounts.", icon: "🏢", href: "/portal/offices", hover: "hover:border-green-500/30 hover:bg-green-500/5" },
                { title: "Manage Stakeholders", desc: "View and manage student and faculty accounts.", icon: "👥", href: "/portal/stakeholders", hover: "hover:border-purple-500/30 hover:bg-purple-500/5" },
                { title: "System Settings", desc: "Configure global system parameters.", icon: "⚙️", href: "/portal/settings", hover: "hover:border-muted-foreground/30 hover:bg-muted/60" },
              ].map((item) => (
                <Link key={item.title} href={item.href}>
                  <div className={`group flex items-start gap-3 p-4 rounded-xl border border-border transition-all cursor-pointer ${item.hover}`}>
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-base flex-shrink-0 mt-0.5">{item.icon}</div>
                    <div>
                      <p className="text-xs font-semibold">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Office accounts table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Office Accounts</p>
                <p className="text-xs text-muted-foreground mt-0.5">All registered office staff</p>
              </div>
              <Link href="/portal/create-office" className="text-xs font-medium text-muted-foreground border border-border px-3 py-1 rounded-lg hover:bg-accent transition-colors">
                + Add Office
              </Link>
            </div>
            <div className="px-5 py-2.5 grid grid-cols-[1fr_130px_80px] gap-3 border-b border-border bg-muted/30">
              {["Name / Office", "Email", "Status"].map((h) => (
                <p key={h} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{h}</p>
              ))}
            </div>
            <div className="px-5 py-12 flex flex-col items-center justify-center text-center">
              <div className="text-3xl mb-3">🏢</div>
              <p className="text-sm font-medium mb-1">No office accounts yet</p>
              <p className="text-xs text-muted-foreground mb-4">Create your first office account to get started.</p>
              <Link href="/portal/create-office">
                <button className="text-xs font-semibold bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                  Create Office Account
                </button>
              </Link>
            </div>
          </div>

        </div>

        {/* Right */}
        <div className="space-y-4">

          {/* System Status */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <p className="text-sm font-semibold">System Status</p>
            </div>
            <div className="p-4 space-y-3">
              {["Authentication", "Database", "File Storage", "Real-time"].map((s) => (
                <div key={s} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-medium text-green-600 dark:text-green-400">Operational</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <p className="text-sm font-semibold">Recent Activity</p>
              <p className="text-xs text-muted-foreground mt-0.5">Audit log</p>
            </div>
            <div className="px-5 py-10 flex flex-col items-center justify-center text-center">
              <div className="text-2xl mb-2">📋</div>
              <p className="text-xs text-muted-foreground">No recent activity logged.</p>
            </div>
          </div>

          {/* Admin card */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-bold text-muted-foreground">
                {firstName[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{adminName}</p>
                <p className="text-xs text-muted-foreground truncate">{process.env.ADMIN_EMAIL ?? "admin@dlsl.edu.ph"}</p>
              </div>
            </div>
            <span className="text-[10px] font-medium bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full">
              System Administrator
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}