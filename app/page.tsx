// app/page.tsx
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/queries/user";
import { Button } from "@/components/ui/button";

export default async function Home() {
  // 1. Redirect if Admin is already logged in
  const cookieStore = await cookies();
  if (cookieStore.get("oks_admin_session")?.value === "authenticated") {
    redirect("/portal/dashboard");
  }

  // 2. Redirect if Stakeholder/Office is already logged in
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const profile = await getCurrentUserProfile();
    if (profile?.role === "office") redirect("/office/dashboard");
    if (profile?.role === "stakeholder") redirect("/stakeholder/dashboard");
  }

  // 3. Render Public Landing Page
  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">

      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-destructive flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 13H2L8 2Z" fill="white" />
              </svg>
            </div>
            <div className="leading-none">
              <p className="text-sm font-bold tracking-tight">Operation Keep Safe</p>
              <p className="text-[10px] text-muted-foreground font-normal">De La Salle Lipa</p>
            </div>
          </div>

          {/* Nav right */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent"
            >
              Login
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="rounded-lg text-sm">
                Sign Up
              </Button>
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center px-6 pt-40 pb-28 text-center">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive border border-destructive/20 text-xs font-medium px-3 py-1.5 rounded-full mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
          Crisis Management Platform · De La Salle Lipa
        </div>

        {/* Main title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.0] max-w-4xl mb-6">
          Operation{" "}
          <span className="text-destructive">Keep Safe!</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl text-muted-foreground font-normal mb-6 tracking-tight">
          Keep safe. Keep informed.
        </p>

        <p className="text-base text-muted-foreground max-w-lg leading-relaxed mb-12 font-normal">
          A centralized platform for DLSL students, faculty, and staff to report
          safety status, request help, and coordinate during emergency situations.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/login">
            <Button size="lg" className="rounded-xl px-8 text-base">
              I'm a Student / Faculty
            </Button>
          </Link>
          <Link href="/login-office">
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl px-8 text-base"
            >
              Office Staff Portal
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-destructive uppercase tracking-widest mb-3">
              What OKS! Does
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything you need during a crisis
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: "🚨",
                title: "Emergency SOS",
                desc: "Send an immediate help request with your location directly to the responsible office.",
                bg: "bg-destructive/10",
              },
              {
                icon: "📢",
                title: "Official Announcements",
                desc: "Receive real-time announcements from campus offices — no more searching through group chats.",
                bg: "bg-blue-500/10",
              },
              {
                icon: "🗺️",
                title: "Crisis Map",
                desc: "See affected areas visualized on a live map so you know exactly what to avoid.",
                bg: "bg-green-500/10",
              },
              {
                icon: "📋",
                title: "Safety Surveys",
                desc: "Offices can deploy quick check-in surveys. You respond in seconds from your phone.",
                bg: "bg-yellow-500/10",
              },
              {
                icon: "🤝",
                title: "Volunteer & Donate",
                desc: "Register as a volunteer or pledge donations — coordinated directly through the system.",
                bg: "bg-purple-500/10",
              },
              {
                icon: "📊",
                title: "Progress Reports",
                desc: "Follow live progress updates from offices managing the situation on the ground.",
                bg: "bg-orange-500/10",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group bg-background border border-border rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center text-xl mb-5`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roles Section ── */}
      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-destructive uppercase tracking-widest mb-3">
              For Everyone at DLSL
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              A role built just for you
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                role: "Student & Faculty",
                icon: "🎓",
                border: "border-blue-500/30",
                bg: "bg-blue-500/5",
                badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                desc: "Report your safety status, view crisis information, request help, take surveys, and stay informed throughout any emergency.",
                cta: "Sign In as Stakeholder",
                href: "/login",
              },
              {
                role: "Office Staff",
                icon: "🏢",
                border: "border-destructive/30",
                bg: "bg-destructive/5",
                badge: "bg-destructive/10 text-destructive border-destructive/20",
                desc: "Manage crises, deploy announcements, triage SOS requests, coordinate volunteers and donations, and post progress reports.",
                cta: "Office Staff Portal",
                href: "/login-office",
              },
            ].map((r) => (
              <div
                key={r.role}
                className={`rounded-2xl border-2 ${r.border} ${r.bg} p-8 flex flex-col`}
              >
                <div className="text-4xl mb-5">{r.icon}</div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${r.badge} w-fit mb-4`}>
                  {r.role}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-7">
                  {r.desc}
                </p>
                <Link href={r.href}>
                  <Button variant="outline" className="w-full rounded-xl" size="sm">
                    {r.cta} →
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-destructive flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 13H2L8 2Z" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-semibold">Operation Keep Safe!</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} De La Salle Lipa · Built for campus safety
          </p>
          <ThemeSwitcher />
        </div>
      </footer>

    </main>
  );
}