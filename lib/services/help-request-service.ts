import { logAction } from "@/lib/queries/audit";
import { createClient } from "@/lib/supabase/server";
import { CreateHelpRequestInput, HelpRequestStatus } from "@/lib/validation/help-request";
import { UserProfile } from "@/types/user";

type ServiceResult =
  | { error?: never; success: true }
  | { error: string; success?: never };

export async function createHelpRequestForStakeholder(
  stakeholderId: string,
  input: CreateHelpRequestInput,
): Promise<ServiceResult> {
  const supabase = await createClient();

  const { error } = await supabase.from("help_request").insert({
    stakeholder_id: stakeholderId,
    crisis_id: input.crisis_id,
    location: input.location,
    notes: input.notes,
    status: "pending",
  });

  if (error) {
    console.error("Failed to create help request:", error);
    return { error: error.message || "Failed to submit request" };
  }

  void logAction({
    actor_id: stakeholderId,
    actor_role: "stakeholder",
    action: "SUBMIT_HELP_REQUEST",
    entity_type: "help_request",
    metadata: { crisis_id: input.crisis_id, location: input.location },
  });

  return { success: true };
}

export async function updateHelpRequestStatusForProfile(
  profile: UserProfile,
  id: string,
  status: HelpRequestStatus,
  officeId?: string,
): Promise<ServiceResult> {
  const supabase = await createClient();

  const updateData: { status: HelpRequestStatus; office_id?: string } = { status };
  if (officeId) updateData.office_id = officeId;

  const { error } = await supabase.from("help_request").update(updateData).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  void logAction({
    actor_id: profile.id,
    actor_role: profile.role,
    action: "UPDATE_HELP_REQUEST_STATUS",
    entity_type: "help_request",
    entity_id: id,
    metadata: { status },
  });

  return { success: true };
}
