// app/(protected)/office/dashboard/page.tsx
import { getCurrentUserProfile } from "@/lib/queries/user";
import { redirect } from "next/navigation";
import Link from "next/link";
import { EmergencyContactsEditor } from "@/components/emergency-contacts-editor";

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {officeName} · Welcome back, {firstName}
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Active Crises",
            value: "2",
            icon: "⚡",
            color: "text-destructive",
            bg: "bg-destructive/10",
            href: "/office/crises",
          },
          {
            label: "Pending SOS",
            value: "3",
            icon: "🆘",
            color: "text-yellow-600 dark:text-yellow-400",
            bg: "bg-yellow-500/10",
            href: "/office/help-requests",
          },
          {
            label: "Volunteers",
            value: "24",
            icon: "🤝",
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-500/10",
            href: "/office/dashboard",
          },
          {
            label: "Donations",
            value: "12",
            icon: "📦",
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-500/10",
            href: "/office/dashboard",
          },
        ].map((card) => (
          <Link key={card.label} href={card.href}>
            <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer">
              <div
                className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center text-base mb-4`}
              >
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
                <p className="text-xs text-muted-foreground mt-0.5">
                  Incoming SOS from stakeholders
                </p>
              </div>
              <Link
                href="/office/help-requests"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="px-5 py-2.5 grid grid-cols-[1fr_120px_80px_70px] gap-3 border-b border-border bg-muted/30">
              {["Stakeholder", "Location", "Status", "Time"].map((h) => (
                <p
                  key={h}
                  className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  {h}
                </p>
              ))}
            </div>
            <div className="divide-y divide-border">
              {[
                {
                  name: "Maria Santos",
                  loc: "Mabini Bldg, 3rd Floor",
                  status: "Pending",
                  time: "2m ago",
                  urgent: true,
                },
                {
                  name: "Juan Dela Cruz",
                  loc: "Main Library, Room 204",
                  status: "Pending",
                  time: "8m ago",
                  urgent: true,
                },
                {
                  name: "Ana Reyes",
                  loc: "Engineering Lab B",
                  status: "Resolved",
                  time: "15m ago",
                  urgent: false,
                },
                {
                  name: "Carlo Mendoza",
                  loc: "Dormitory Block C",
                  status: "Pending",
                  time: "22m ago",
                  urgent: true,
                },
              ].map((req) => (
                <div
                  key={req.name}
                  className="px-5 py-3 grid grid-cols-[1fr_120px_80px_70px] gap-3 items-center hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 ${
                        req.urgent ? "bg-destructive" : "bg-muted-foreground"
                      }`}
                    >
                      {req.name[0]}
                    </div>
                    <p className="text-xs font-semibold truncate">{req.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{req.loc}</p>
                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-full w-fit ${
                      req.status === "Pending"
                        ? "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400"
                        : "bg-green-500/15 text-green-700 dark:text-green-400"
                    }`}
                  >
                    {req.status}
                  </span>
                  <p className="text-[10px] text-muted-foreground">{req.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Crises */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Active Crises</p>
                <p className="text-xs text-muted-foreground mt-0.5">Currently managed incidents</p>
              </div>
              <Link
                href="/office/crises"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="divide-y divide-border">
              {[
                {
                  type: "Typhoon",
                  name: "Typhoon Carina — signal #2 affecting campus grounds",
                  severity: "high",
                  loc: "Main Campus, Mabini Bldg",
                  time: "2h ago",
                },
                {
                  type: "Flood",
                  name: "Flash flood warning for low-lying areas near dormitories",
                  severity: "high",
                  loc: "Dormitory Area, Grounds",
                  time: "4h ago",
                },
              ].map((c) => (
                <div
                  key={c.type}
                  className="px-5 py-4 flex items-start gap-3 hover:bg-muted/20 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm">⚡</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-semibold">{c.type}</p>
                      <span className="text-[10px] font-semibold bg-destructive/15 text-destructive px-1.5 py-0.5 rounded-full">
                        {c.severity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{c.name}</p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span>📍 {c.loc}</span>
                      <span>· {c.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — profile card + today's summary */}
        <div className="space-y-4">
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
            <div className="flex gap-1.5 mb-4">
              <span className="text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                Office Staff
              </span>
              <span className="text-[10px] font-medium bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full truncate">
                {officeName}
              </span>
            </div>
            <div className="pt-4 border-t border-border space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Today&apos;s Summary
              </p>
              {[
                { label: "Requests Resolved", value: "5" },
                { label: "Announcements Sent", value: "2" },
                { label: "Surveys Active", value: "1" },
                { label: "Volunteers Deployed", value: "8" },
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