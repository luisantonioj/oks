import { createClient } from "@/lib/supabase/server";
import { UserProfile } from "@/types/user";

type PolicyResult =
  | { ok: true; error?: never }
  | { ok: false; error: string };

async function assertOfficeOwnsRecord(
  profile: UserProfile,
  table: "announcement" | "survey",
  id: string,
  messages: { notFound: string; forbidden: string },
): Promise<PolicyResult> {
  if (profile.role === "admin") {
    return { ok: true };
  }

  if (profile.role !== "office") {
    return { ok: false, error: "Unauthorized" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(table)
    .select("office_id")
    .eq("id", id)
    .single();

  if (error || !data) {
    return { ok: false, error: messages.notFound };
  }

  if (data.office_id !== profile.id) {
    return { ok: false, error: messages.forbidden };
  }

  return { ok: true };
}

export async function assertCanManageAnnouncement(
  profile: UserProfile,
  announcementId: string,
): Promise<PolicyResult> {
  return assertOfficeOwnsRecord(profile, "announcement", announcementId, {
    notFound: "Announcement not found",
    forbidden: "Unauthorized: You do not own this announcement",
  });
}

export async function assertCanManageSurvey(
  profile: UserProfile,
  surveyId: string,
): Promise<PolicyResult> {
  return assertOfficeOwnsRecord(profile, "survey", surveyId, {
    notFound: "Survey not found",
    forbidden: "Unauthorized: You do not own this survey",
  });
}
