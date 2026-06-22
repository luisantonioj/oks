// app/portal/layout.tsx
import { getCurrentUserProfile } from "@/lib/queries/user";
import { redirect } from "next/navigation";
import { AdminNavbar } from "@/components/admin-navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "admin") {
    redirect("/login-portal");
  }

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
