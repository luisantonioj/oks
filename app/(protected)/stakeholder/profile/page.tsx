// app/(protected)/stakeholder/profile/page.tsx
import { getCurrentUserProfile } from "@/lib/queries/user";
import { redirect } from "next/navigation";
import { StakeholderProfileClient } from "@/components/stakeholder-profile-client";

export default async function StakeholderProfile() {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "stakeholder") {
    redirect("/login");
  }

  // Dummy data fallbacks so page always looks populated
  const displayData = {
    name: profile.name || "Mikayla Buno",
    email: profile.email || "mikay@dlsl.edu.ph",
    age: profile.age ? String(profile.age) : "20",
    community: profile.community || "college",
    contact: profile.contact || "+63 912 345 6789",
    permanent_address: profile.permanent_address || "123 Rizal St., Lipa City, Batangas",
    current_address: profile.current_address || "DLSL Dormitory, Block A, Room 204",
    created_at: profile.created_at || "2026-03-04T00:00:00Z",
    updated_at: profile.updated_at || "2026-03-04T00:00:00Z",
  };

  return (
    <StakeholderProfileClient
      initialData={displayData}
      userId={profile.id}
    />
  );
}
