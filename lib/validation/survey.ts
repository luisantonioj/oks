import { z } from "zod";
import { getOptionalString, getRequiredString } from "@/lib/validation/form-data";

export const surveyTypeSchema = z.enum(["safety", "donation", "volunteer"]);

export const surveyQuestionSchema = z
  .object({
    id: z.string().min(1, "Question ID is required."),
    text: z.string().trim().min(1, "Question text is required."),
    type: z.enum(["text", "radio", "checkbox"]),
    options: z.array(z.string().trim()).optional(),
  })
  .transform((question) => ({
    ...question,
    options: question.options?.filter(Boolean),
  }))
  .refine(
    (question) => question.type === "text" || Boolean(question.options?.length),
    "Choice questions must include at least one option.",
  );

export const createSurveyInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  survey_type: surveyTypeSchema,
  crisis_id: z.string().trim().min(1, "Crisis is required."),
  questions: z.array(surveyQuestionSchema).min(1, "At least one question with text is required."),
});

export const submitSurveyResponseInputSchema = z.object({
  survey_id: z.string().trim().min(1, "Survey ID is required."),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
  receipt: z.instanceof(File).optional(),
});

export type SurveyQuestion = z.infer<typeof surveyQuestionSchema>;
export type CreateSurveyInput = z.infer<typeof createSurveyInputSchema>;
export type SubmitSurveyResponseInput = z.infer<typeof submitSurveyResponseInputSchema>;

function parseQuestions(raw: string) {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new Error("Invalid questions format");
  }
}

export function createSurveyInputFromFormData(formData: FormData): CreateSurveyInput {
  return createSurveyInputSchema.parse({
    title: getRequiredString(formData, "title"),
    survey_type: getRequiredString(formData, "survey_type"),
    crisis_id: getRequiredString(formData, "crisis_id"),
    questions: parseQuestions(getRequiredString(formData, "questions")),
  });
}

export function surveyResponseInputFromFormData(formData: FormData): SubmitSurveyResponseInput {
  const answers: Record<string, string | string[]> = {};

  formData.forEach((value, key) => {
    if (!key.startsWith("q_") || typeof value !== "string") return;

    const questionId = key.replace("q_", "");
    const existing = answers[questionId];
    const answer = value.trim();

    if (!answer) return;

    if (existing) {
      answers[questionId] = Array.isArray(existing) ? [...existing, answer] : [existing, answer];
    } else {
      answers[questionId] = answer;
    }
  });

  const stakeholderName = getOptionalString(formData, "__stake_name");
  if (stakeholderName) answers.__stake_name = stakeholderName;

  const receiptValue = formData.get("__receipt");
  const receipt =
    receiptValue instanceof File && receiptValue.size > 0 && receiptValue.name !== "undefined"
      ? receiptValue
      : undefined;

  return submitSurveyResponseInputSchema.parse({
    survey_id: getRequiredString(formData, "survey_id"),
    answers,
    receipt,
  });
}
