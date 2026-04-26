// app/(protected)/stakeholder/announcements/page.tsx
import { getCurrentUserProfile } from "@/lib/queries/user";
import { getAnnouncements } from "@/lib/queries/announcement";
import { getCrises } from "@/lib/queries/crisis";
import { redirect } from "next/navigation";
import StakeholderAnnouncementsClient from "./StakeholderAnnouncementsClient";

export default async function StakeholderAnnouncementsPage() {
  // 1. Verify user is authenticated
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "stakeholder") {
    redirect("/login");
  }

  // 2. Fetch real data securely on the server
  // We use getCrises() instead of getActiveCrises() so past announcements still map to their crisis names properly
  const announcements = await getAnnouncements();
  const crises = await getCrises();

  return (
    <StakeholderAnnouncementsClient 
      initialAnnouncements={announcements} 
      crises={crises} 
    />
  );
}