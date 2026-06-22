import { z } from "zod";
import { getOptionalString, getRequiredString } from "@/lib/validation/form-data";

export const announcementPrioritySchema = z.enum(["normal", "high"]);

export const createAnnouncementInputSchema = z.object({
  title: z.string().min(1, "Title is required."),
  content: z.string().min(1, "Content is required."),
  crisis_id: z.string().min(1, "Crisis ID is required."),
  priority: announcementPrioritySchema.default("normal"),
});

export const updateAnnouncementInputSchema = createAnnouncementInputSchema.extend({
  id: z.string().min(1, "Announcement ID is required."),
});

export type AnnouncementPriority = z.infer<typeof announcementPrioritySchema>;
export type CreateAnnouncementInput = z.infer<typeof createAnnouncementInputSchema>;
export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncementInputSchema>;

export function announcementInputFromFormData(formData: FormData): CreateAnnouncementInput {
  return createAnnouncementInputSchema.parse({
    title: getRequiredString(formData, "title"),
    content: getRequiredString(formData, "content"),
    crisis_id: getRequiredString(formData, "crisis_id"),
    priority: getOptionalString(formData, "priority") ?? "normal",
  });
}

export function announcementUpdateInputFromFormData(formData: FormData): UpdateAnnouncementInput {
  return updateAnnouncementInputSchema.parse({
    id: getRequiredString(formData, "id"),
    title: getRequiredString(formData, "title"),
    content: getRequiredString(formData, "content"),
    crisis_id: getRequiredString(formData, "crisis_id"),
    priority: getOptionalString(formData, "priority") ?? "normal",
  });
}
