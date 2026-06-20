// app/portal/layout.tsx
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { adminSignOut } from "@/app/actions/auth";
import { getCurrentUserProfile } from "@/lib/queries/user";
import { redirect } from "next/navigation";
import { AdminNavbar } from "@/components/admin-navbar";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "admin") {
    redirect("/login-portal");
  }

  const adminName = process.env.ADMIN_NAME || "Administrator";
  const firstName = adminName.split(" ")[0];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Unified Client-side Navigation Bar */}
      <AdminNavbar />

      {/* Main Page Content */}
      <main className="flex-1 bg-muted/20">
        {children}
      </main>
    </div>
  );
}