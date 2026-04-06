"use client";

// components/admin-navbar.tsx
// This is what app/portal/layout.tsx imports as <AdminNavbar />
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SignOutButton } from "@/components/sign-out-modal";

export function AdminNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Dashboard", href: "/portal/dashboard" },
    { label: "Offices", href: "/portal/offices" },
    { label: "Stakeholders", href: "/portal/stakeholders" },
    { label: "Settings", href: "/portal/settings" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="w-full px-6 h-14 flex items-center justify-between gap-4">

          {/* Left: Logo */}
          <Link href="/portal/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-md bg-destructive flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 13H2L8 2Z" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight hidden sm:block">OKS! Admin</span>
          </Link>

          {/* Center: Nav links (desktop) */}
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

          {/* Right: Actions (desktop) */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <ThemeSwitcher />
            <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold text-muted-foreground">
              A
            </div>
            <SignOutButton role="admin" />
          </div>

          {/* Burger (mobile) */}
          <button
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-accent transition-colors"
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
        <div className="md:hidden fixed inset-0 z-30 flex">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 ml-auto w-64 h-full bg-background border-l border-border flex flex-col p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-7 h-7 rounded-md bg-destructive flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 13H2L8 2Z" fill="white" /></svg>
              </div>
              <span className="text-sm font-bold">OKS! Admin</span>
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
                      isActive ? "bg-accent font-semibold text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold text-muted-foreground">
                A
              </div>
              <span className="text-xs text-muted-foreground flex-1 truncate">Administrator</span>
              <ThemeSwitcher />
              <SignOutButton role="admin" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}