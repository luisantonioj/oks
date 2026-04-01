// app/(auth)/login/page.tsx
import { LoginForm } from "@/components/login-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/queries/user";
import Link from "next/link";
import { Suspense } from "react";
import { EnvVarWarning } from "@/components/env-var-warning";
import { hasEnvVars } from "@/lib/utils";

export default async function LoginPage() {
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

          {/* Logo */}
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
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-3">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Sign in to your stakeholder account to access crisis information,
              request help, and stay updated.
            </p>
          </div>

          {/* Form */}
          <div className="mb-8">
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <LoginForm />
              </Suspense>
            )}
          </div>

          {/* Switch link */}
          <div className="pt-6 border-t border-border">
            <Link
              href="/login-office"
              className="flex items-center justify-between w-full text-sm px-4 py-3 rounded-xl border border-border hover:bg-accent hover:border-border/80 transition-all group"
            >
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                Signing in as Office Staff?
              </span>
              <span className="text-sm font-medium text-foreground flex items-center gap-1">
                Office Portal
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 6h6M6.5 3.5L9 6l-2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>

        </div>
      </div>

      {/* ── Right: Illustration Panel ── */}
      <div className="hidden lg:flex flex-1 bg-card border-l border-border items-center justify-center p-8 xl:p-16 relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-destructive/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-muted/60 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm">
          {/* Mock SOS card */}
          <div className="w-full bg-background rounded-2xl border border-border shadow-lg p-6 mb-5 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center text-lg flex-shrink-0">
                🚨
              </div>
              <div>
                <p className="text-xs font-semibold">Emergency Alert</p>
                <p className="text-[10px] text-muted-foreground">Just now</p>
              </div>
              <div className="ml-auto">
                <span className="text-[10px] font-medium bg-destructive text-white px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
            </div>
            <p className="text-sm font-semibold mb-1">Typhoon Ondoy — Level 2</p>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
              Affected: Main Campus, Engineering Bldg. Evacuation routes active.
            </p>
            <div className="flex gap-2">
              <div className="flex-1 bg-destructive text-white text-xs font-semibold py-2.5 rounded-lg text-center">
                I Need Help
              </div>
              <div className="flex-1 bg-muted text-foreground text-xs font-semibold py-2.5 rounded-lg text-center">
                I'm Safe
              </div>
            </div>
          </div>

          {/* Safety stats row */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { v: "1,240", l: "Safe" },
              { v: "38", l: "Pending" },
              { v: "12", l: "SOS Sent" },
            ].map((s) => (
              <div key={s.l} className="bg-background border border-border rounded-xl py-4 px-2 text-center">
                <p className="text-lg font-bold">{s.v}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-3">
            Your safety, our priority
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Access real-time crisis updates, request assistance, and connect
            with campus offices — all from one place.
          </p>
        </div>
      </div>

    </div>
  );
}