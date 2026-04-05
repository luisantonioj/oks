// app/(auth)/login-portal/page.tsx
import { AdminLoginForm } from "@/components/admin-login-form";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPortalPage() {
  // 1. Session Checks (Zero-Flash Redirects) — UPDATED TO SUPABASE
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // If they are already logged in, check if they actually have Admin rights
    let isAuthorized = false;

    const { data: admin } = await supabase.from("admin").select("id").eq("id", user.id).maybeSingle();
    if (admin) isAuthorized = true;

    if (!isAuthorized) {
      const { data: office } = await supabase.from("office").select("is_admin").eq("id", user.id).maybeSingle();
      if (office?.is_admin) isAuthorized = true;
    }

    // If they are authorized, skip the login screen
    if (isAuthorized) {
      redirect("/portal/dashboard");
    }
  }

  // 2. Render UI
  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Left: Form Panel ── */}
      <div className="flex-1 flex items-center justify-center px-8 py-16 xl:px-16">
        <div className="w-full max-w-md">

          {/* Back link */}
          <div className="mb-8">
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

          {/* Logo + badge */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-destructive flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 13H2L8 2Z" fill="white" />
              </svg>
            </div>
            <div className="leading-none">
              <p className="text-sm font-bold tracking-tight">Operation Keep Safe!</p>
              <p className="text-[10px] text-muted-foreground font-normal">De La Salle Lipa</p>
            </div>
            <span className="ml-1 text-xs font-medium bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full">
              Administrator
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-3">
              Admin Access
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Authorized system administrators only. This area grants full control
              over the OKS! platform, users, and office accounts.
            </p>
          </div>

          {/* Warning strip */}
          <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/25 rounded-xl p-4 mb-7">
            <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L13 12H1L7 1.5Z" stroke="currentColor" strokeWidth="1.3" className="text-destructive" />
                <path d="M7 5.5v3M7 10v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="text-destructive" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-destructive mb-0.5">
                Restricted Access
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Unauthorized access attempts are logged. This portal is for
                designated system administrators only.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="mb-8">
            <AdminLoginForm />
          </div>

          {/* Footer links */}
          <div className="pt-6 border-t border-border flex items-center justify-between">
            <Link
              href="/login"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Stakeholder Login
            </Link>
            <Link
              href="/login-office"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Office Login
            </Link>
          </div>

        </div>
      </div>

      {/* ── Right: Illustration Panel ── */}
      <div className="hidden lg:flex flex-1 bg-card border-l border-border items-center justify-center p-8 xl:p-16 relative overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.4,
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-muted/50 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm">
          {/* Admin panel mock */}
          <div className="bg-background rounded-2xl border border-border shadow-lg overflow-hidden mb-6">
            {/* Top bar */}
            <div className="bg-muted/50 border-b border-border px-4 py-3 flex items-center justify-between">
              <p className="text-xs font-semibold">System Administration</p>
              <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                v2.0
              </span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 border-b border-border">
              {[
                { v: "3", l: "Offices", icon: "🏢" },
                { v: "1,280", l: "Users", icon: "👥" },
                { v: "7", l: "Crises", icon: "⚡" },
              ].map((s) => (
                <div key={s.l} className="py-4 text-center border-r border-border last:border-r-0">
                  <div className="text-lg mb-0.5">{s.icon}</div>
                  <p className="text-base font-bold">{s.v}</p>
                  <p className="text-[9px] text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>

            {/* Action list */}
            <div className="p-4 space-y-2">
              {[
                { label: "Create Office Account", icon: "➕" },
                { label: "Manage Stakeholders", icon: "👤" },
                { label: "System Settings", icon: "⚙️" },
              ].map((a) => (
                <div key={a.label} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/40">
                  <span className="text-sm">{a.icon}</span>
                  <span className="text-xs font-medium flex-1 text-left">{a.label}</span>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-muted-foreground">
                    <path d="M3 5h4M5.5 3L7 5l-1.5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-3">
            Full system control
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Manage office accounts, monitor platform health, and oversee all
            institutional data from a single secure portal.
          </p>
        </div>
      </div>

    </div>
  );
}