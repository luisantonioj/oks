// app/portal/layout.tsx
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { adminSignOut } from "@/app/actions/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminNavbar } from "@/components/admin-navbar";
import { Button } from "@/components/ui/button";

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