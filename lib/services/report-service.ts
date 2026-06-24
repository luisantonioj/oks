import { logAction } from "@/lib/services/audit-service";
import { createClient } from "@/lib/supabase/server";
import { UserProfile } from "@/types/user";

export interface ProgressReportInput {
  crisis_id: string;
  title: string;
  content: string;
  icon: string;
}

type ServiceResult =
  | { error?: never; success: true }
  | { error: string; success?: never };

function canManageReports(profile: UserProfile) {
  return profile.role === "office" || profile.role === "admin";
}

export async function createProgressReportForProfile(
  profile: UserProfile,
  input: ProgressReportInput,
): Promise<ServiceResult> {
  if (!canManageReports(profile)) {
    return { error: "Unauthorized" };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("progress_report").insert({
    crisis_id: input.crisis_id,
    title: input.title,
    content: input.content,
    icon: input.icon,
    office_id: profile.id,
  });

  if (error) {
    return { error: error.message };
  }

  void logAction({
    actor_id: profile.id,
    actor_role: profile.role,
    action: "CREATE_PROGRESS_REPORT",
    entity_type: "progress_report",
    metadata: { crisis_id: input.crisis_id, title: input.title },
  });

  return { success: true };
}

export async function updateProgressReportForProfile(
  profile: UserProfile,
  reportId: string,
  input: ProgressReportInput,
): Promise<ServiceResult> {
  if (!canManageReports(profile)) {
    return { error: "Unauthorized" };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("progress_report")
    .update({
      crisis_id: input.crisis_id,
      title: input.title,
      content: input.content,
      icon: input.icon,
    })
    .eq("id", reportId)
    .eq("office_id", profile.id);

  if (error) {
    return { error: error.message };
  }

  void logAction({
    actor_id: profile.id,
    actor_role: profile.role,
    action: "UPDATE_PROGRESS_REPORT",
    entity_type: "progress_report",
    entity_id: reportId,
    metadata: { crisis_id: input.crisis_id, title: input.title },
  });

  return { success: true };
}
