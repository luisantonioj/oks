// app/(protected)/stakeholder/layout.tsx
import { getCurrentUserProfile } from "@/lib/queries/user";
import { redirect } from "next/navigation";
import { StakeholderNavbar } from "@/features/navigation/StakeholderNavbar";
import { DashboardRealtimeWatcher } from "@/features/navigation/DashboardRealtimeWatcher";
import { routes } from "@/lib/routes";

export default async function StakeholderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "stakeholder") {
    redirect(routes.auth.login.stakeholder);
  }

  const name = profile.name ?? "Stakeholder";
  const firstName = name.split(" ")[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardRealtimeWatcher role="stakeholder" userId={profile.id} />
      <StakeholderNavbar firstName={firstName} />
      <main className="w-full">{children}</main>
    </div>
  );
}
