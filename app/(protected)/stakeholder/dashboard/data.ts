import { getAnnouncements } from "@/lib/queries/announcement";
import { getActiveCrises } from "@/lib/queries/crisis";
import { getSurveys, getStakeholderRespondedSurveyIds } from "@/lib/queries/survey";
import { getCurrentUserProfile } from "@/lib/queries/user";
import { createClient } from "@/lib/supabase/server";

export async function getStakeholderDashboardData() {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "stakeholder") {
    return null;
  }

  const supabase = await createClient();

  const [
    activeCrises,
    allAnnouncements,
    allActiveSurveys,
    respondedSurveyIds,
    { data: dbContacts },
  ] = await Promise.all([
    getActiveCrises(),
    getAnnouncements(),
    getSurveys({ status: "active" }),
    getStakeholderRespondedSurveyIds(profile.id),
    supabase.from("emergency_contact").select("*").order("created_at", { ascending: true }),
  ]);

  const name = profile.name ?? "Stakeholder";
  const firstName = name.split(" ")[0];
  const email = profile.email ?? "";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const pendingSurveysCount = allActiveSurveys.filter(
    (survey) => !respondedSurveyIds.includes(survey.id),
  ).length;

  return {
    activeCrises,
    allAnnouncements,
    dbContacts,
    name,
    firstName,
    email,
    greeting,
    pendingSurveysCount,
  };
}
