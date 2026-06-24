// app/(protected)/office/layout.tsx
import { getCurrentUserProfile } from "@/lib/queries/user";
import { redirect } from "next/navigation";
import { OfficeNavbar } from "@/components/office-navbar";
import { DashboardRealtimeWatcher } from "@/components/DashboardRealtimeWatcher";
import { routes } from "@/lib/routes";

export default async function OfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "office") {
    redirect(routes.auth.login.office);
  }

  const officeName = profile.office_name ?? "Office";
  const name = profile.name ?? "Officer";
  const firstName = name.split(" ")[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardRealtimeWatcher role="office" userId={profile.id} />
      <OfficeNavbar firstName={firstName} officeName={officeName} />
      <main className="w-full">{children}</main>
    </div>
  );
}
