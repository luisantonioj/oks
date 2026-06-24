import { createClient } from "@/lib/supabase/server";
import { UserProfile } from "@/types/user";

export interface OfficeProfileInput {
  name: string;
  age: number | null;
  gender: string;
  contact: string;
}

export interface StakeholderProfileInput {
  name: string;
  age: number | null;
  contact: string;
  permanent_address: string;
  current_address: string;
}

type ServiceResult =
  | { error?: never; success: true }
  | { error: string; success?: never };

export async function updateOfficeProfileForProfile(
  profile: UserProfile,
  input: OfficeProfileInput,
): Promise<ServiceResult> {
  if (profile.role !== "office") {
    return { error: "Unauthorized" };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("office")
    .update({
      name: input.name,
      age: input.age,
      gender: input.gender,
      contact: input.contact,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (error) {
    console.error("Failed to update office profile:", error);
    return { error: error.message || "Failed to update profile" };
  }

  return { success: true };
}

export async function updateStakeholderProfileForProfile(
  profile: UserProfile,
  input: StakeholderProfileInput,
): Promise<ServiceResult> {
  if (profile.role !== "stakeholder") {
    return { error: "Unauthorized" };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("stakeholder")
    .update({
      name: input.name,
      age: input.age,
      contact: input.contact,
      permanent_address: input.permanent_address,
      current_address: input.current_address,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (error) {
    console.error("Failed to update stakeholder profile:", error);
    return { error: error.message || "Failed to update profile" };
  }

  return { success: true };
}
