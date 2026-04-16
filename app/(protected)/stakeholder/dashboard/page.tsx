// app/(protected)/stakeholder/dashboard/page.tsx
import { getCurrentUserProfile } from "@/lib/queries/user";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SOSButton } from "@/components/SOSButton";

export default async function StakeholderDashboard() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "stakeholder") {
    redirect("/login");
  }

  const name = profile.name ?? "Stakeholder";
  const firstName = name.split(" ")[0];
  const email = profile.email ?? "";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Here&apos;s your current situation overview.
        </p>
      </div>

      {/* ── Active Crisis Banner ── */}
      <div className="flex items-center justify-between gap-4 bg-destructive/10 border border-destructive/25 rounded-2xl px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 13H2L8 2Z" stroke="currentColor" strokeWidth="1.3" />
              <path
                d="M8 6v4M8 11v.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-destructive flex items-center gap-2">
              Active Crisis Detected
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-destructive text-white px-2 py-0.5 rounded-full">
                Live
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Campus offices are managing an active crisis. Check announcements for the latest
              updates.
            </p>
          </div>
        </div>
        <Link
          href="/stakeholder/announcements"
          className="text-xs font-semibold text-destructive hover:underline flex-shrink-0"
        >
          View →
        </Link>
      </div>

      {/* ── Stat Cards — animated SOS + 3 regular ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        {/* SOS — animated pulsing card */}
        <SOSButton variant="card" />

        {/* Active Crises */}
        <Link href="/stakeholder/announcements">
          <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer h-full">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-base mb-4">
              ⚡
            </div>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">2</p>
            <p className="text-xs font-semibold mt-1">Active Crises</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Ongoing incidents</p>
          </div>
        </Link>

        {/* Announcements */}
        <Link href="/stakeholder/announcements">
          <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer h-full">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-base mb-4">
              📢
            </div>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">5</p>
            <p className="text-xs font-semibold mt-1">Announcements</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Unread messages</p>
          </div>
        </Link>

        {/* Open Surveys */}
        <Link href="/stakeholder/surveys">
          <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer h-full">
            <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center text-base mb-4">
              📋
            </div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">1</p>
            <p className="text-xs font-semibold mt-1">Open Surveys</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Awaiting response</p>
          </div>
        </Link>
      </div>

      {/* ── Emergency Contacts ── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 3.5A1.5 1.5 0 014.5 2h.879a1 1 0 01.95.684l.73 2.19a1 1 0 01-.23 1.02L5.5 6.72A9.015 9.015 0 009.28 10.5l.826-1.33a1 1 0 011.02-.23l2.19.73A1 1 0 0114 10.621V11.5A1.5 1.5 0 0112.5 13C6.701 13 2 8.299 2 2.5A1.5 1.5 0 013.5 1h.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold">Emergency Contacts</p>
            <p className="text-xs text-muted-foreground">
              Save these numbers — call immediately during emergencies
            </p>
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                label: "DLSL Security Office",
                number: "109",
                note: "On-campus security & emergency dispatch",
                icon: "🏫",
                color: "bg-blue-500/10 border-blue-500/20",
                numColor: "text-blue-600 dark:text-blue-400",
              },
              {
                label: "DLSL Health Services",
                number: "110",
                note: "Medical assistance & first aid on campus",
                icon: "🏥",
                color: "bg-green-500/10 border-green-500/20",
                numColor: "text-green-600 dark:text-green-400",
              },
              {
                label: "ISESSO Hotline",
                number: "112",
                note: "Institutional Safety & Emergency Services",
                icon: "🛡️",
                color: "bg-orange-500/10 border-orange-500/20",
                numColor: "text-orange-600 dark:text-orange-400",
              },
              {
                label: "Lipa City Fire Station",
                number: "(043) 756-2873",
                note: "Fire emergencies in Lipa City",
                icon: "🚒",
                color: "bg-red-500/10 border-red-500/20",
                numColor: "text-destructive",
              },
              {
                label: "Lipa City Police Station",
                number: "(043) 756-0099",
                note: "Law enforcement & public safety",
                icon: "🚔",
                color: "bg-indigo-500/10 border-indigo-500/20",
                numColor: "text-indigo-600 dark:text-indigo-400",
              },
              {
                label: "National Emergency Hotline",
                number: "911",
                note: "Police, fire & medical emergencies",
                icon: "📞",
                color: "bg-destructive/10 border-destructive/25",
                numColor: "text-destructive",
              },
            ].map((c) => (
              <div key={c.label} className={`rounded-xl border p-4 ${c.color}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0 mt-0.5">{c.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold mb-0.5">{c.label}</p>
                    <p className={`text-lg font-black tracking-tight leading-none ${c.numColor}`}>
                      {c.number}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                      {c.note}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-muted-foreground mt-4 flex items-center gap-1.5">
            <svg
              width="11"
              height="11"
              viewBox="0 0 14 14"
              fill="none"
              className="flex-shrink-0"
            >
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
              <path
                d="M7 6v4M7 4.5v.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            Contact numbers may be updated by campus offices. Check this section regularly during
            active crisis situations.
          </p>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">

        {/* Left — Recent Announcements */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Recent Announcements</p>
              <p className="text-xs text-muted-foreground mt-0.5">Latest from campus offices</p>
            </div>
            <Link
              href="/stakeholder/announcements"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="divide-y divide-border">
            {[
              {
                title: "Classes Suspended — Typhoon Carina",
                tag: "Urgent",
                office: "CIO",
                time: "2 hours ago",
                desc: "All classes are suspended effective immediately due to Typhoon Carina. Please proceed to designated evacuation areas.",
                read: false,
              },
              {
                title: "Evacuation Routes Update",
                tag: "Urgent",
                office: "ISESSO",
                time: "3 hours ago",
                desc: "Evacuation routes have been updated. Refer to posted maps in all buildings for the nearest exits and assembly points.",
                read: false,
              },
              {
                title: "Relief Operations Begin Tomorrow",
                tag: null,
                office: "CIO",
                time: "5 hours ago",
                desc: "Relief operations will commence at 8AM tomorrow. Volunteers may report to the gymnasium for assignment.",
                read: true,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="px-5 py-4 flex items-start gap-3 hover:bg-muted/30 transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    item.read ? "bg-muted-foreground/30" : "bg-destructive"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-semibold">{item.title}</p>
                    {item.tag && (
                      <span className="text-[10px] font-semibold bg-destructive/15 text-destructive px-1.5 py-0.5 rounded-full flex-shrink-0">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{item.desc}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                      {item.office}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Profile card */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-bold text-muted-foreground flex-shrink-0">
                {firstName[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{name}</p>
                <p className="text-xs text-muted-foreground truncate">{email}</p>
              </div>
              <Link href="/stakeholder/profile">
                <button className="text-xs font-medium text-muted-foreground border border-border px-2.5 py-1 rounded-lg hover:bg-accent transition-colors">
                  Edit
                </button>
              </Link>
            </div>
            <span className="text-[10px] font-medium bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full">
              Stakeholder
            </span>
          </div>

          {/* Active Situations */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <p className="text-sm font-semibold">Active Situations</p>
            </div>
            <div className="p-3 space-y-2">
              {[
                {
                  type: "Typhoon",
                  desc: "Typhoon Carina affecting Batangas province",
                  severity: "high",
                },
                {
                  type: "Flood",
                  desc: "Flash flood warning for low-lying areas near campus",
                  severity: "high",
                },
              ].map((s) => (
                <div
                  key={s.type}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/50"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm">⚡</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-semibold">{s.type}</p>
                      <span className="text-[9px] font-semibold bg-destructive/15 text-destructive px-1.5 py-0.5 rounded-full">
                        {s.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}