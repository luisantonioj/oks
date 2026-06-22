import { z } from "zod";
import { getOptionalString, getRequiredString } from "@/lib/validation/form-data";

export const helpRequestStatusSchema = z.enum(["pending", "resolved"]);

export const createHelpRequestInputSchema = z.object({
  location: z.string().min(1, "Location is required."),
  crisis_id: z.string().min(1, "Crisis ID is required."),
  notes: z.string().optional(),
});

export type HelpRequestStatus = z.infer<typeof helpRequestStatusSchema>;
export type CreateHelpRequestInput = z.infer<typeof createHelpRequestInputSchema>;

export function helpRequestInputFromFormData(formData: FormData): CreateHelpRequestInput {
  return createHelpRequestInputSchema.parse({
    location: getRequiredString(formData, "location"),
    crisis_id: getRequiredString(formData, "crisis_id"),
    notes: getOptionalString(formData, "notes"),
  });
}
