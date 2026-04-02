// app/(protected)/stakeholder/layout.tsx
import { getCurrentUserProfile } from "@/lib/queries/user";
import { redirect } from "next/navigation";
import { StakeholderNavbar } from "@/components/stakeholder-navbar";

export default async function StakeholderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "stakeholder") {
    redirect("/login");
  }

  const name = profile.name ?? "Stakeholder";
  const firstName = name.split(" ")[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StakeholderNavbar firstName={firstName} />
      <main className="w-full">{children}</main>
    </div>
  );
}