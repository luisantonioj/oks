import { z } from "zod";
import { getOptionalString, getRequiredString, parseCommaSeparated } from "@/lib/validation/form-data";

const crisisFeatureSchema = z.object({
  survey: z.boolean(),
  help_button: z.boolean(),
  progress: z.boolean(),
  donation: z.boolean(),
  volunteer: z.boolean(),
  notify_stakeholders: z.boolean(),
  sound_alarm: z.boolean(),
  request_backup: z.boolean(),
  lockdown_areas: z.boolean(),
});

export const crisisStatusSchema = z.enum(["active", "resolved"]);

export const crisisInputSchema = z.object({
  name: z.string().min(1, "Name is required."),
  type: z.string().min(1, "Type is required."),
  severity: z.string().min(1, "Severity is required."),
  summary: z.string().optional(),
  required_actions: z.string().optional(),
  affected_areas: z.array(z.string()),
  features: crisisFeatureSchema,
});

export const crisisUpdateInputSchema = crisisInputSchema.extend({
  id: z.string().min(1, "Crisis ID is missing."),
});

export type CrisisInput = z.infer<typeof crisisInputSchema>;
export type CrisisUpdateInput = z.infer<typeof crisisUpdateInputSchema>;
export type CrisisStatus = z.infer<typeof crisisStatusSchema>;

export function crisisInputFromFormData(formData: FormData): CrisisInput {
  return crisisInputSchema.parse({
    name: getRequiredString(formData, "name"),
    type: getRequiredString(formData, "type"),
    severity: getRequiredString(formData, "severity"),
    summary: getOptionalString(formData, "summary"),
    required_actions: getOptionalString(formData, "required_actions"),
    affected_areas: parseCommaSeparated(getOptionalString(formData, "affected_areas")),
    features: {
      survey: formData.get("feature_survey") === "on",
      help_button: formData.get("feature_help_button") === "on",
      progress: formData.get("feature_progress") === "on",
      donation: formData.get("feature_donation") === "on",
      volunteer: formData.get("feature_volunteer") === "on",
      notify_stakeholders: formData.get("feature_notify") === "on",
      sound_alarm: formData.get("feature_alarm") === "on",
      request_backup: formData.get("feature_backup") === "on",
      lockdown_areas: formData.get("feature_lockdown") === "on",
    },
  });
}

export function crisisUpdateInputFromFormData(formData: FormData): CrisisUpdateInput {
  return crisisUpdateInputSchema.parse({
    id: getRequiredString(formData, "id"),
    ...crisisInputFromFormData(formData),
  });
}
