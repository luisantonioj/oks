import { z } from "zod";
import { isDlslEmail, normalizeEmail } from "@/lib/validation/email";
import { getOptionalString, getRequiredString } from "@/lib/validation/form-data";

const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const optionalNumberSchema = z.coerce.number().int().positive().nullable();

export const signInInputSchema = z.object({
  email: z.string().email("Invalid email address").transform(normalizeEmail),
  password: z.string().min(1, "Email and password required"),
});

export const stakeholderSignupInputSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .transform(normalizeEmail)
    .refine(isDlslEmail, "Email must be a valid DLSL address"),
  password: passwordSchema,
  name: z.string().min(1, "Name is required"),
  age: optionalNumberSchema,
  community: z.string().optional(),
  contact: z.string().optional(),
  permanentAddress: z.string().optional(),
  currentAddress: z.string().optional(),
});

export const createOfficeInputSchema = z.object({
  email: z.string().email("Invalid email format").transform(normalizeEmail),
  password: passwordSchema,
  name: z.string().min(1, "Full Name is required"),
  officeName: z.string().min(1, "Office Name is required"),
  age: optionalNumberSchema,
  gender: z.string().optional(),
  contact: z.string().optional(),
});

export type SignInInput = z.infer<typeof signInInputSchema>;
export type StakeholderSignupInput = z.infer<typeof stakeholderSignupInputSchema>;
export type CreateOfficeInput = z.infer<typeof createOfficeInputSchema>;

export function signInInputFromFormData(formData: FormData): SignInInput {
  return signInInputSchema.parse({
    email: getRequiredString(formData, "email"),
    password: getRequiredString(formData, "password"),
  });
}

export function stakeholderSignupInputFromFormData(formData: FormData): StakeholderSignupInput {
  return stakeholderSignupInputSchema.parse({
    email: getRequiredString(formData, "email"),
    password: getRequiredString(formData, "password"),
    name: getRequiredString(formData, "name"),
    age: getOptionalString(formData, "age") ?? null,
    community: getOptionalString(formData, "community"),
    contact: getOptionalString(formData, "contact"),
    permanentAddress: getOptionalString(formData, "permanent_address"),
    currentAddress: getOptionalString(formData, "current_address"),
  });
}

export function createOfficeInputFromFormData(formData: FormData): CreateOfficeInput {
  return createOfficeInputSchema.parse({
    email: getRequiredString(formData, "email"),
    password: getRequiredString(formData, "password"),
    name: getRequiredString(formData, "name"),
    officeName: getRequiredString(formData, "office_name"),
    age: getOptionalString(formData, "age") ?? null,
    gender: getOptionalString(formData, "gender"),
    contact: getOptionalString(formData, "contact"),
  });
}
