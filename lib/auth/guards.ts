import { getCurrentUserProfile } from "@/lib/queries/user";
import { UserProfile, UserRole } from "@/types/user";

export type AuthResult =
  | { ok: true; profile: UserProfile }
  | { ok: false; error: string };

export async function requireAuthenticatedUser(): Promise<AuthResult> {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return { ok: false, error: "Unauthorized" };
  }

  return { ok: true, profile };
}

export async function requireAnyRole(roles: UserRole[]): Promise<AuthResult> {
  const result = await requireAuthenticatedUser();

  if (!result.ok) {
    return result;
  }

  if (!roles.includes(result.profile.role)) {
    return { ok: false, error: "Unauthorized" };
  }

  return result;
}

export async function requireRole(role: UserRole): Promise<AuthResult> {
  return requireAnyRole([role]);
}
