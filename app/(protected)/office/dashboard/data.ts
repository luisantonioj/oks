import { getDashboardStats, getCrisisSummary } from "@/lib/queries/crisis";
import { getAllHelpRequests } from "@/lib/queries/help-request";
import { getCurrentUserProfile } from "@/lib/queries/user";
import { createClient } from "@/lib/supabase/server";

export async function getOfficeDashboardData() {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "office") {
    return null;
  }

  const supabase = await createClient();

  const [stats, activeCrisesList, recentRequests, { data: dbContacts }] = await Promise.all([
    getDashboardStats(),
    getCrisisSummary(),
    getAllHelpRequests(),
    supabase.from("emergency_contact").select("*").eq("office_id", profile.id).order("created_at", { ascending: true }),
  ]);

  const topRequests = recentRequests.slice(0, 5);
  const officeName = profile.office_name ?? "Office";
  const name = profile.name ?? "Officer";
  const firstName = name.split(" ")[0];

  return {
    profile,
    stats,
    activeCrisesList,
    topRequests,
    dbContacts: dbContacts ?? [],
    officeName,
    name,
    firstName,
  };
}
