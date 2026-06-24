import { logAction } from "@/lib/services/audit-service";
import { createClient } from "@/lib/supabase/server";
import { CrisisInput, CrisisStatus, CrisisUpdateInput } from "@/lib/validation/crisis";
import { UserProfile } from "@/types/user";

type ServiceResult<T = void> =
  | { data: T; error?: never }
  | { data?: never; error: string };

export async function createCrisisForProfile(
  profile: UserProfile,
  input: CrisisInput,
): Promise<ServiceResult<{ id: string }>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("crisis")
    .insert({
      name: input.name,
      type: input.type,
      summary: input.summary,
      affected_areas: input.affected_areas,
      severity: input.severity,
      required_actions: input.required_actions,
      features: input.features,
      status: "active",
      office_id: profile.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Failed to create crisis:", error);
    return { error: error?.message || "Failed to create crisis" };
  }

  void logAction({
    actor_id: profile.id,
    actor_role: profile.role,
    action: "CREATE_CRISIS",
    entity_type: "crisis",
    entity_id: data.id,
    metadata: { name: input.name, type: input.type, severity: input.severity },
  });

  return { data: { id: data.id } };
}

export async function updateCrisisForProfile(
  profile: UserProfile,
  input: CrisisUpdateInput,
): Promise<ServiceResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("crisis")
    .update({
      name: input.name,
      type: input.type,
      summary: input.summary,
      affected_areas: input.affected_areas,
      severity: input.severity,
      required_actions: input.required_actions,
      features: input.features,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id);

  if (error) {
    return { error: error.message };
  }

  void logAction({
    actor_id: profile.id,
    actor_role: profile.role,
    action: "UPDATE_CRISIS",
    entity_type: "crisis",
    entity_id: input.id,
    metadata: { name: input.name, type: input.type, severity: input.severity },
  });

  return { data: undefined };
}

export async function updateCrisisStatusForProfile(
  profile: UserProfile,
  id: string,
  status: CrisisStatus,
  resolutionNotes?: string,
): Promise<ServiceResult> {
  const supabase = await createClient();

  const updateData: { status: CrisisStatus; updated_at: string; resolution_notes?: string } = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (resolutionNotes?.trim()) {
    updateData.resolution_notes = resolutionNotes.trim();
  }

  const { error } = await supabase.from("crisis").update(updateData).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  void logAction({
    actor_id: profile.id,
    actor_role: profile.role,
    action: "UPDATE_CRISIS_STATUS",
    entity_type: "crisis",
    entity_id: id,
    metadata: { status },
  });

  return { data: undefined };
}

export async function deleteCrisisForProfile(
  profile: UserProfile,
  id: string,
): Promise<ServiceResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("crisis").delete().eq("id", id).select("id");

  if (error) {
    return { error: error.message };
  }

  if (!data || data.length === 0) {
    return {
      error: "Delete blocked by Database. Please check your Supabase RLS Policies for the crisis table.",
    };
  }

  void logAction({
    actor_id: profile.id,
    actor_role: profile.role,
    action: "DELETE_CRISIS",
    entity_type: "crisis",
    entity_id: id,
  });

  return { data: undefined };
}
