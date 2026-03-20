// app/(auth)/login-office/page.tsx
import { OfficeLoginForm } from "@/components/office-login-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/queries/user";
import Link from "next/link";

export default async function LoginOfficePage() {
  // 1. Session Checks (Zero-Flash Redirects) — UNCHANGED
  const cookieStore = await cookies();
  if (cookieStore.get("oks_admin_session")?.value === "authenticated") {
    redirect("/portal/dashboard");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const profile = await getCurrentUserProfile();
    if (profile?.role === "office") redirect("/office/dashboard");
    if (profile?.role === "stakeholder") redirect("/stakeholder/dashboard");
  }

  // 2. Render UI
  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Left: Form Panel ── */}
      <div className="flex-1 flex flex-col justify-center px-12 py-12 xl:px-20">

        {/* Back link */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M8.5 2.5L4 7l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to home
          </Link>
        </div>

        {/* Logo + role badge */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg bg-destructive flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 13H2L8 2Z" fill="white" />
            </svg>
          </div>
          <div className="leading-none">
            <p className="text-sm font-bold tracking-tight">Operation Keep Safe!</p>
            <p className="text-[10px] text-muted-foreground font-normal">De La Salle Lipa</p>
          </div>
          <span className="ml-1 text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
            Office Staff
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Office Portal
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Sign in to manage crisis operations, deploy announcements, and
            coordinate emergency response for De La Salle Lipa.
          </p>
        </div>

        {/* Info strip */}
        <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-7 max-w-md">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" className="text-blue-500" />
              <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="text-blue-500" />
            </svg>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This portal is for authorized office staff only. Your account must
            be created by the system administrator.
          </p>
        </div>

        {/* Form */}
        <div className="w-full max-w-md">
          <OfficeLoginForm />
        </div>

        {/* Switch link */}
        <div className="mt-8 pt-8 border-t border-border max-w-md">
          <Link
            href="/login"
            className="flex items-center justify-between w-full text-sm px-4 py-3 rounded-xl border border-border hover:bg-accent hover:border-border/80 transition-all group"
          >
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              Signing in as a student or faculty?
            </span>
            <span className="text-sm font-medium text-foreground flex items-center gap-1">
              Stakeholder Login
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 6h6M6.5 3.5L9 6l-2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      {/* ── Right: Illustration Panel ── */}
      <div className="hidden lg:flex flex-1 bg-card border-l border-border flex-col items-center justify-center p-12 xl:p-20 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-muted/60 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm">
          {/* Command center mock */}
          <div className="bg-background rounded-2xl border border-border shadow-lg p-5 mb-5 text-left">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold">Command Center</p>
                <p className="text-[10px] text-muted-foreground">ISESSO · Live View</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">Online</span>
              </div>
            </div>

            {/* Mini stat row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { v: "3", l: "Crises", color: "text-destructive" },
                { v: "27", l: "SOS", color: "text-yellow-600 dark:text-yellow-400" },
                { v: "480", l: "Safe", color: "text-green-600 dark:text-green-400" },
              ].map((s) => (
                <div key={s.l} className="bg-muted/50 rounded-lg py-3 text-center">
                  <p className={`text-base font-bold ${s.color}`}>{s.v}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>

            {/* SOS list */}
            {[
              { name: "Maria Santos", loc: "Mabini Bldg 3F", time: "1m ago", urgent: true },
              { name: "Juan Dela Cruz", loc: "Main Library", time: "4m ago", urgent: false },
            ].map((req) => (
              <div key={req.name} className="flex items-center gap-2.5 py-2.5 border-t border-border/50">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 ${req.urgent ? "bg-destructive" : "bg-muted-foreground"}`}>
                  {req.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold truncate">{req.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{req.loc}</p>
                </div>
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${req.urgent ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"}`}>
                  {req.time}
                </span>
              </div>
            ))}
          </div>

          {/* Quick action row */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {["Post Announcement", "Dispatch Team"].map((label) => (
              <div key={label} className="bg-background border border-border rounded-xl py-3 px-3 text-xs font-medium text-center text-muted-foreground">
                {label}
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-3">
            Coordinate with clarity
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your command center for managing every aspect of campus crisis
            response — fast, clear, and accountable.
          </p>
        </div>
      </div>
    </div>
  );
}