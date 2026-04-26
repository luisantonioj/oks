// app/portal/dashboard/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAllOffices, getAllStakeholders } from "@/lib/queries/user";
import { getDashboardStats } from "@/lib/queries/crisis";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("oks_admin_session")?.value;
  if (adminSession !== "authenticated") {
    redirect("/login-portal");
  }

  // Fetch all necessary data concurrently from Supabase
  const [offices, stakeholders, stats] = await Promise.all([
    getAllOffices(),
    getAllStakeholders(),
    getDashboardStats(),
  ]);

  const adminName = process.env.ADMIN_NAME || "Administrator";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@dlsl.edu.ph";
  const firstName = adminName.split(" ")[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

      {/* ── Header — display only, no buttons ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Administration</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome back, {firstName}. Full platform oversight.
        </p>
      </div>

      {/* ── Audit banner ── */}
      <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 rounded-2xl px-5 py-3.5">
        <div className="w-6 h-6 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5L13 12H1L7 1.5Z" stroke="currentColor" strokeWidth="1.3" />
            <path d="M7 5.5v3M7 10v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-destructive">Admin session active.</span>{" "}
          All actions are logged for audit and accountability. Do not share your credentials.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Offices", value: offices.length.toString(), icon: "🏢", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
          { label: "Stakeholders", value: stakeholders.length.toString(), icon: "👥", color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10" },
          { label: "Total Crises", value: stats.totalCrises.toString(), icon: "⚡", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10" },
          { label: "Active Crises", value: stats.activeCrises.toString(), icon: "🚨", color: "text-destructive", bg: "bg-destructive/10" },
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

        {/* Left — Office Accounts table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Office Accounts</p>
              <p className="text-xs text-muted-foreground mt-0.5">Recently registered office staff</p>
            </div>
            <Link href="/portal/offices" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </Link>
          </div>
          <div className="px-5 py-2.5 grid grid-cols-[1fr_180px_80px_60px] gap-3 border-b border-border bg-muted/30">
            {["Name / Office", "Email", "Status", ""].map((h) => (
              <p key={h} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{h}</p>
            ))}
          </div>
          <div className="divide-y divide-border">
            {offices.length === 0 ? (
              <div className="px-5 py-4 text-center text-xs text-muted-foreground">
                No office accounts found.
              </div>
            ) : (
              offices.slice(0, 5).map((officer: any) => (
                <div key={officer.id} className="px-5 py-3 grid grid-cols-[1fr_180px_80px_60px] gap-3 items-center hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[11px] font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">
                      {(officer.name || "O")[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{officer.name || "Office User"}</p>
                      <p className="text-[10px] text-muted-foreground">{officer.office_name || "Office"}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{officer.email}</p>
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full w-fit bg-green-500/15 text-green-700 dark:text-green-400`}>
                    Active
                  </span>
                  <Link href="/portal/offices" className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                    View →
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Administrator card — first */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-bold text-muted-foreground flex-shrink-0">
                {firstName[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{adminName}</p>
                <p className="text-xs text-muted-foreground truncate">{adminEmail}</p>
              </div>
            </div>
            <span className="text-[10px] font-medium bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full">
              System Administrator
            </span>
          </div>

          {/* System Status */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <p className="text-sm font-semibold">System Status</p>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "Authentication", status: "Operational" },
                { label: "Database", status: "Operational" },
                { label: "File Storage", status: "Operational" },
                { label: "Real-time", status: "Operational" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-medium text-green-600 dark:text-green-400">{s.status}</span>
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