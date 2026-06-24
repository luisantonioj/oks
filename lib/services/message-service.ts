import { logAction } from "@/lib/services/audit-service";
import { createClient } from "@/lib/supabase/server";
import { UserProfile } from "@/types/user";

type SenderRole = "office" | "stakeholder";

export interface SendMessageInput {
  help_request_id: string;
  content: string;
  sender_role: string;
}

type ServiceResult =
  | { error?: never; success: true }
  | { error: string; success?: never };

export async function sendMessageForProfile(
  profile: UserProfile,
  input: SendMessageInput,
): Promise<ServiceResult> {
  const content = input.content.trim();
  const helpRequestId = input.help_request_id;

  if (!content || !helpRequestId || !input.sender_role) {
    return { error: "Message cannot be empty." };
  }

  if (profile.role !== "office" && profile.role !== "stakeholder") {
    return { error: "Unauthorized." };
  }

  if (input.sender_role !== profile.role) {
    return { error: "Unauthorized." };
  }

  const supabase = await createClient();

  const { data: helpRequest, error: requestError } = await supabase
    .from("help_request")
    .select("stakeholder_id")
    .eq("id", helpRequestId)
    .single();

  if (requestError || !helpRequest) {
    return { error: "Help request not found." };
  }

  if (profile.role === "stakeholder" && helpRequest.stakeholder_id !== profile.id) {
    return { error: "Unauthorized." };
  }

  const senderRole: SenderRole = profile.role;
  const senderName = profile.role === "office" ? profile.office_name : profile.name;

  const { error } = await supabase.from("message").insert({
    help_request_id: helpRequestId,
    sender_id: profile.id,
    sender_role: senderRole,
    sender_name: senderName,
    content,
  });

  if (error) {
    console.error("Error sending message:", error);
    return { error: "Failed to send message. Please try again." };
  }

  void logAction({
    actor_id: profile.id,
    actor_role: profile.role,
    actor_name: senderName,
    action: "SEND_MESSAGE",
    entity_type: "message",
    metadata: { help_request_id: helpRequestId },
  });

  return { success: true };
}
