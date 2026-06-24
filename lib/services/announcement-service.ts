import { assertCanManageAnnouncement } from "@/lib/auth/policies";
import { logAction } from "@/lib/services/audit-service";
import { createClient } from "@/lib/supabase/server";
import {
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from "@/lib/validation/announcement";
import { UserProfile } from "@/types/user";

type ServiceResult =
  | { error?: never; success: true }
  | { error: string; success?: never };

export async function createAnnouncementForProfile(
  profile: UserProfile,
  input: CreateAnnouncementInput,
): Promise<ServiceResult> {
  const supabase = await createClient();

  const { error } = await supabase.from("announcement").insert({
    title: input.title,
    content: input.content,
    priority: input.priority,
    crisis_id: input.crisis_id,
    office_id: profile.id,
  });

  if (error) {
    console.error("Failed to create announcement:", error);
    return { error: error.message || "Failed to create announcement" };
  }

  void logAction({
    actor_id: profile.id,
    actor_role: profile.role,
    action: "CREATE_ANNOUNCEMENT",
    entity_type: "announcement",
    metadata: { title: input.title, crisis_id: input.crisis_id },
  });

  return { success: true };
}

export async function deleteAnnouncementForProfile(
  profile: UserProfile,
  id: string,
): Promise<ServiceResult> {
  const policy = await assertCanManageAnnouncement(profile, id);
  if (!policy.ok) return { error: policy.error };

  const supabase = await createClient();

  const { error } = await supabase.from("announcement").delete().eq("id", id);
  if (error) return { error: error.message };

  void logAction({
    actor_id: profile.id,
    actor_role: profile.role,
    action: "DELETE_ANNOUNCEMENT",
    entity_type: "announcement",
    entity_id: id,
  });

  return { success: true };
}

export async function updateAnnouncementForProfile(
  profile: UserProfile,
  input: UpdateAnnouncementInput,
): Promise<ServiceResult> {
  const policy = await assertCanManageAnnouncement(profile, input.id);
  if (!policy.ok) return { error: policy.error };

  const supabase = await createClient();

  const { error } = await supabase
    .from("announcement")
    .update({
      title: input.title,
      content: input.content,
      priority: input.priority,
      crisis_id: input.crisis_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id);

  if (error) {
    console.error("Failed to update announcement:", error);
    return { error: error.message || "Failed to update announcement" };
  }

  void logAction({
    actor_id: profile.id,
    actor_role: profile.role,
    action: "UPDATE_ANNOUNCEMENT",
    entity_type: "announcement",
    entity_id: input.id,
    metadata: { title: input.title, crisis_id: input.crisis_id },
  });

  return { success: true };
}
