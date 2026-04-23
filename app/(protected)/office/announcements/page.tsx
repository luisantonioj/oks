// app/(protected)/office/announcements/page.tsx
import { getAnnouncements } from "@/lib/queries/announcement";
import { getActiveCrises } from "@/lib/queries/crisis";
import AnnouncementsClient from "./AnnouncementsClient";

export default async function OfficeAnnouncementsPage() {
  // Fetch real data from the database securely on the server
  const announcements = await getAnnouncements();
  const crises = await getActiveCrises();

  return (
    <AnnouncementsClient 
      initialAnnouncements={announcements} 
      crises={crises} 
    />
  );
}