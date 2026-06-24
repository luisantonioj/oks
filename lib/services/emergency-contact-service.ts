import { createClient } from "@/lib/supabase/server";
import { UserProfile } from "@/types/user";

export interface EmergencyContactInput {
  label: string;
  number: string;
  note: string;
  icon: string;
}

type ServiceResult =
  | { error?: never; success: true }
  | { error: string; success?: never };

export async function updateEmergencyContactsForProfile(
  profile: UserProfile,
  officeId: string,
  contacts: EmergencyContactInput[],
): Promise<ServiceResult> {
  if (!officeId) return { error: "Office ID is missing" };

  if (
    (profile.role !== "office" && profile.role !== "admin") ||
    (profile.role === "office" && profile.id !== officeId)
  ) {
    return { error: "Unauthorized" };
  }

  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("emergency_contact")
    .delete()
    .eq("office_id", officeId);

  if (deleteError) {
    console.error("Error clearing old contacts:", deleteError);
    return { error: deleteError.message };
  }

  if (contacts.length > 0) {
    const newContacts = contacts.map((contact) => ({
      office_id: officeId,
      label: contact.label,
      number: contact.number,
      note: contact.note,
      icon: contact.icon,
    }));

    const { error: insertError } = await supabase.from("emergency_contact").insert(newContacts);

    if (insertError) {
      console.error("Error inserting new contacts:", insertError);
      return { error: insertError.message };
    }
  }

  await supabase.from("office").update({ updated_at: new Date().toISOString() }).eq("id", officeId);

  return { success: true };
}
