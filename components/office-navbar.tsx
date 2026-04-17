"use client";

// components/office-navbar.tsx
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SignOutButton } from "@/components/sign-out-modal";

interface OfficeNavbarProps {
  firstName: string;
  officeName: string;
}

export function OfficeNavbar({ firstName, officeName }: OfficeNavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Dashboard",     href: "/office/dashboard" },
    { label: "Crises",        href: "/office/crises" },
    { label: "Help Requests", href: "/office/help-requests" },
    { label: "Announcements", href: "/office/announcements" },
    { label: "Surveys",       href: "/office/surveys" },
    { label: "Reports",       href: "/office/reports" },
    { label: "Inbox",         href: "/office/inbox" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="w-full px-6 h-14 flex items-center justify-between gap-4">

          {/* Left: Logo + office badge */}
          <Link href="/office/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-md bg-destructive flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 13H2L8 2Z" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight">OKS!</span>
          </Link>
          <span className="hidden sm:block text-xs font-medium text-muted-foreground border border-border bg-muted/50 px-2 py-0.5 rounded-full flex-shrink-0">
            {officeName}
          </span>

          {/* Center: Nav links (desktop) */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((n) => {
              const isActive = pathname === n.href || pathname.startsWith(n.href + "/");
              return (
                <Link
                  key={n.label}
                  href={n.href}
                  className={`text-sm px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
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

          {/* Right: Actions (desktop) */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <ThemeSwitcher />
            <Link href="/office/profile">
              <div
                className={`w-8 h-8 rounded-full bg-blue-500/15 border flex items-center justify-center text-xs font-semibold text-blue-600 dark:text-blue-400 transition-colors ${
                  pathname.startsWith("/office/profile")
                    ? "border-blue-500/50"
                    : "border-blue-500/20 hover:border-blue-500/40"
                }`}
              >
                {firstName[0]?.toUpperCase()}
              </div>
            </Link>
            <span className="text-xs text-muted-foreground hidden xl:block">{officeName}</span>
            <SignOutButton role="office" />
          </div>

          {/* Burger (mobile/tablet) */}
          <button
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            )}
          </button>

        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 ml-auto w-72 h-full bg-background border-l border-border flex flex-col p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-7 h-7 rounded-md bg-destructive flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L14 13H2L8 2Z" fill="white" />
                </svg>
              </div>
              <span className="text-sm font-bold">OKS!</span>
              <span className="ml-auto text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {officeName}
              </span>
            </div>
            <nav className="flex flex-col gap-1 flex-1">
              {navLinks.map((n) => {
                const isActive = pathname === n.href || pathname.startsWith(n.href + "/");
                return (
                  <Link
                    key={n.label}
                    href={n.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm px-3 py-2.5 rounded-xl transition-colors ${
                      isActive
                        ? "bg-accent font-semibold text-foreground"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Link href="/office/profile" onClick={() => setMobileOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {firstName[0]?.toUpperCase()}
                </div>
              </Link>
              <span className="text-xs text-muted-foreground flex-1 truncate">{firstName}</span>
              <ThemeSwitcher />
              <SignOutButton role="office" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}