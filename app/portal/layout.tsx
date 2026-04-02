// app/portal/layout.tsx
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { adminSignOut } from "@/app/actions/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("oks_admin_session")?.value;

  if (adminSession !== "authenticated") {
    redirect("/login-portal");
  }

  const adminName = process.env.ADMIN_NAME || "Administrator";
  const firstName = adminName.split(" ")[0];

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Shared Admin Navbar ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="w-full px-6 h-14 flex items-center justify-between gap-4">

          {/* Left: Logo + badge */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-7 h-7 rounded-md bg-destructive flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 13H2L8 2Z" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight hidden sm:block">OKS!</span>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <span className="text-xs font-medium bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full hidden sm:block">
              System Admin
            </span>
          </div>

          {/* Center: Nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: "Dashboard", href: "/portal/dashboard" },
              { label: "Offices", href: "/portal/offices" },
              { label: "Stakeholders", href: "/portal/stakeholders" },
              { label: "Settings", href: "/portal/settings" },
            ].map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className="text-sm px-3 py-1.5 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/60"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Right: Theme + Avatar + Sign out */}
          <div className="flex items-center gap-2 flex-shrink-0">
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

      {/* ── Page Content ── */}
      <main className="w-full">
        {children}
      </main>

    </div>
  );
}