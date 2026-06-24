import { logAction } from "@/lib/services/audit-service";
import { assertCanManageSurvey } from "@/lib/auth/policies";
import { createClient } from "@/lib/supabase/server";
import { CreateSurveyInput, SubmitSurveyResponseInput } from "@/lib/validation/survey";
import { UserProfile } from "@/types/user";

const RECEIPTS_BUCKET = "receipts";

type ServiceResult =
  | { success: true; error?: never }
  | { success?: never; error: string };

async function uploadReceipt(stakeholderId: string, receipt: File) {
  const supabase = await createClient();
  const bytes = await receipt.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileExt = receipt.name.split(".").pop() || "png";
  const path = `${stakeholderId}/${Date.now()}_receipt.${fileExt}`;

  const { error } = await supabase.storage.from(RECEIPTS_BUCKET).upload(path, buffer, {
    contentType: receipt.type,
    duplex: "half",
  });

  if (error) {
    console.error("[survey] Storage upload error:", error);
    return { error: "Failed to upload payment receipt." };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(RECEIPTS_BUCKET).getPublicUrl(path);

  return { publicUrl };
}

export async function createSurveyForProfile(
  profile: UserProfile,
  input: CreateSurveyInput,
): Promise<ServiceResult> {
  const supabase = await createClient();

  const { error } = await supabase.from("survey").insert({
    title: input.title,
    survey_type: input.survey_type,
    crisis_id: input.crisis_id,
    questions: JSON.stringify(input.questions),
    office_id: profile.id,
    status: "active",
  });

  if (error) {
    return { error: error.message || "Failed to create survey" };
  }

  void logAction({
    actor_id: profile.id,
    actor_role: profile.role,
    action: "CREATE_SURVEY",
    entity_type: "survey",
    metadata: {
      title: input.title,
      survey_type: input.survey_type,
      crisis_id: input.crisis_id,
    },
  });

  return { success: true };
}

export async function submitSurveyResponseForStakeholder(
  stakeholderId: string,
  input: SubmitSurveyResponseInput,
): Promise<ServiceResult> {
  const supabase = await createClient();

  const { data: surveyData } = await supabase
    .from("survey")
    .select("status")
    .eq("id", input.survey_id)
    .single();

  if (!surveyData || surveyData.status !== "active") {
    return { error: "This survey is no longer accepting responses." };
  }

  const { data: existing } = await supabase
    .from("survey_response")
    .select("id")
    .eq("survey_id", input.survey_id)
    .eq("stakeholder_id", stakeholderId)
    .maybeSingle();

  if (existing) {
    return { error: "You have already responded to this survey" };
  }

  const answers = { ...input.answers };

  if (input.receipt) {
    const receiptResult = await uploadReceipt(stakeholderId, input.receipt);
    if (receiptResult.error) return { error: receiptResult.error };
    if (!receiptResult.publicUrl) return { error: "Failed to get payment receipt URL." };
    answers.__receipt = receiptResult.publicUrl;
  }

  const { error } = await supabase.from("survey_response").insert({
    survey_id: input.survey_id,
    stakeholder_id: stakeholderId,
    answers: JSON.stringify(answers),
  });

  if (error) {
    return { error: error.message || "Failed to submit response" };
  }

  void logAction({
    actor_id: stakeholderId,
    actor_role: "stakeholder",
    action: "SUBMIT_SURVEY_RESPONSE",
    entity_type: "survey_response",
    entity_id: input.survey_id,
  });

  return { success: true };
}

export async function closeSurveyForProfile(profile: UserProfile, surveyId: string): Promise<ServiceResult> {
  const supabase = await createClient();

  const policy = await assertCanManageSurvey(profile, surveyId);
  if (!policy.ok) return { error: policy.error };

  const { error } = await supabase.from("survey").update({ status: "closed" }).eq("id", surveyId);
  if (error) return { error: error.message };

  void logAction({
    actor_id: profile.id,
    actor_role: profile.role,
    action: "CLOSE_SURVEY",
    entity_type: "survey",
    entity_id: surveyId,
  });

  return { success: true };
}
