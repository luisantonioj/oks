// app/(auth)/login-portal/page.tsx
import { AdminLoginForm } from "@/components/admin-login-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LoginPortalPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("oks_admin_session")?.value === "authenticated") {
    redirect("/portal/dashboard");
  }

  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Left: Form Panel ── */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* Top row: back button LEFT + logo RIGHT on same horizontal line */}
        <div className="flex-shrink-0 flex items-center gap-4 px-8 xl:px-16 pt-6 pb-0">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border bg-background px-3 py-1.5 rounded-lg hover:bg-accent flex-shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M8.5 2.5L4 7l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Link>

          {/* Logo — same row as back button */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-destructive flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 13H2L8 2Z" fill="white" />
              </svg>
            </div>
            <div className="leading-none">
              <p className="text-sm font-bold tracking-tight">Operation Keep Safe!</p>
              <p className="text-[10px] text-muted-foreground">De La Salle Lipa</p>
            </div>
            <span className="ml-1 text-xs font-medium bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full">
              Administrator
            </span>
          </div>
        </div>

        {/* Centered form content */}
        <div className="flex-1 flex items-center justify-center px-8 xl:px-16 py-8">
          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-5">
              <h1 className="text-3xl font-bold tracking-tight mb-1.5">Admin Access</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Authorized system administrators only. This area grants full control
                over the OKS! platform, users, and office accounts.
              </p>
            </div>

            {/* Warning strip */}
            <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/25 rounded-xl p-3.5 mb-4">
              <div className="w-6 h-6 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5L13 12H1L7 1.5Z" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M7 5.5v3M7 10v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-destructive mb-0.5">Restricted Access</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Unauthorized access attempts are logged. This portal is for designated system administrators only.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="mb-4">
              <AdminLoginForm />
            </div>

            {/* Footer links */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Stakeholder Login
              </Link>
              <Link href="/login-office" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Office Login
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ── Right: Illustration Panel ── */}
      <div className="hidden lg:flex flex-1 bg-card border-l border-border items-center justify-center p-8 xl:p-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.35,
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-muted/50 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm">
          <div className="bg-background rounded-2xl border border-border shadow-lg overflow-hidden mb-6">
            <div className="bg-muted/50 border-b border-border px-4 py-3 flex items-center justify-between">
              <p className="text-xs font-semibold">System Administration</p>
              <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">v2.0</span>
            </div>
            <div className="grid grid-cols-3 border-b border-border">
              {[{ v: "3", l: "Offices", icon: "🏢" }, { v: "1,280", l: "Users", icon: "👥" }, { v: "7", l: "Crises", icon: "⚡" }].map((s) => (
                <div key={s.l} className="py-4 text-center border-r border-border last:border-r-0">
                  <div className="text-lg mb-0.5">{s.icon}</div>
                  <p className="text-base font-bold">{s.v}</p>
                  <p className="text-[9px] text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
            <div className="p-4 space-y-2">
              {[{ label: "Create Office Account", icon: "➕" }, { label: "Manage Stakeholders", icon: "👤" }, { label: "System Settings", icon: "⚙️" }].map((a) => (
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
          <h2 className="text-2xl font-bold tracking-tight mb-2">Full system control</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Manage office accounts, monitor platform health, and oversee all institutional data from a single secure portal.
          </p>
        </div>
      </div>
    </div>
  );
}