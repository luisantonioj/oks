"use client";

// components/stakeholder-navbar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { signOut } from "@/app/actions/auth";

interface StakeholderNavbarProps {
  firstName: string;
}

export function StakeholderNavbar({ firstName }: StakeholderNavbarProps) {
  const pathname = usePathname();

  const navLinks = [
    { label: "Dashboard", href: "/stakeholder/dashboard" },
    { label: "Announcements", href: "/stakeholder/announcements" },
    { label: "Surveys", href: "/stakeholder/surveys" },
    { label: "My Requests", href: "/stakeholder/help-requests" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="w-full px-6 h-14 flex items-center justify-between gap-4">

        {/* Left: Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Link href="/stakeholder/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-destructive flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 13H2L8 2Z" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight hidden sm:block">OKS!</span>
          </Link>
        </div>

        {/* Center: Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((n) => {
            const isActive = pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link
                key={n.label}
                href={n.href}
                className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-accent font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Theme + Profile + Sign Out */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ThemeSwitcher />
          <Link href="/stakeholder/profile">
            <div className={`w-8 h-8 rounded-full bg-muted border flex items-center justify-center text-xs font-semibold text-muted-foreground transition-colors ${
              pathname.startsWith("/stakeholder/profile")
                ? "border-foreground text-foreground"
                : "border-border hover:border-muted-foreground/40"
            }`}>
              {firstName[0]?.toUpperCase()}
            </div>
          </Link>
          <form action={signOut}>
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
  );
}