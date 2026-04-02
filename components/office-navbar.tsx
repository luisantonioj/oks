"use client";

// components/office-navbar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { signOut } from "@/app/actions/auth";

interface OfficeNavbarProps {
  firstName: string;
  officeName: string;
}

export function OfficeNavbar({ firstName, officeName }: OfficeNavbarProps) {
  const pathname = usePathname();

  const navLinks = [
    { label: "Dashboard", href: "/office/dashboard" },
    { label: "Crises", href: "/office/crises" },
    { label: "Help Requests", href: "/office/help-requests" },
    { label: "Announcements", href: "/office/announcements" },
    { label: "Surveys", href: "/office/surveys" },
    { label: "Reports", href: "/office/reports" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="w-full px-6 h-14 flex items-center justify-between gap-4">

        {/* Left: Logo + office name */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/office/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-destructive flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 13H2L8 2Z" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight hidden sm:block">OKS!</span>
          </Link>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <span className="text-xs font-medium text-muted-foreground hidden sm:block truncate max-w-[140px]">
            {officeName}
          </span>
        </div>

        {/* Center: Nav links */}
        <nav className="hidden lg:flex items-center gap-1">
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

        {/* Right: Theme + Avatar + Sign Out */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ThemeSwitcher />
          <Link href="/office/profile">
            <div className={`w-8 h-8 rounded-full bg-blue-500/20 border flex items-center justify-center text-xs font-semibold text-blue-600 dark:text-blue-400 transition-colors ${
              pathname.startsWith("/office/profile")
                ? "border-blue-500"
                : "border-blue-500/30 hover:border-blue-500/60"
            }`}>
              {firstName[0]?.toUpperCase()}
            </div>
          </Link>
          <div className="hidden sm:block leading-none">
            <p className="text-xs font-semibold">{firstName}</p>
            <p className="text-[10px] text-muted-foreground">{officeName}</p>
          </div>
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