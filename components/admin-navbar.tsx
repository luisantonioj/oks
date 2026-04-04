// components/admin-navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "./theme-switcher";
import { adminSignOut } from "@/app/actions/auth";

export function AdminNavbar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/portal/dashboard" },
    { name: "Offices", href: "/portal/offices" },
    { name: "Stakeholders", href: "/portal/stakeholders" },
    { name: "Settings", href: "/portal/settings" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="w-full px-6 h-14 flex items-center justify-between">
        
        {/* ── Left: Logo ── */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-destructive flex items-center justify-center flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 13H2L8 2Z" fill="white" />
            </svg>
          </div>
          <span className="text-sm font-bold tracking-tight text-red-600">OKS! Admin</span>
        </div>

        {/* ── Center: Nav links ── */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            // Check if the current path is exactly the link, or if we are in a sub-route
            const isActive = 
              pathname === link.href || 
              (pathname.startsWith(link.href) && link.href !== '/portal/dashboard');

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* ── Right: Theme & Logout ── */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <form action={adminSignOut}>
            <button 
              type="submit" 
              className="text-xs font-medium text-muted-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
            >
              Logout
            </button>
          </form>
        </div>

      </div>
    </header>
  );
}