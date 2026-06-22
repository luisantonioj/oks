import { requireRole } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";
import { Office, Stakeholder } from "@/types/database";

async function requireAdminAccess() {
  const auth = await requireRole("admin");
  if (!auth.ok) {
    throw new Error("Unauthorized: Admin only");
  }

  return auth.profile;
}

export async function getAllOfficesForAdmin(): Promise<Office[]> {
  await requireAdminAccess();

  try {
    const adminSupabase = createAdminClient();

    const { data, error } = await adminSupabase
      .from("office")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as Office[];
  } catch (error) {
    console.error("Unable to load office accounts for admin dashboard.", error);
    return [];
  }
}

export async function getAllStakeholdersForAdmin(): Promise<Stakeholder[]> {
  await requireAdminAccess();

  try {
    const adminSupabase = createAdminClient();

    const { data, error } = await adminSupabase
      .from("stakeholder")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as Stakeholder[];
  } catch (error) {
    console.error("Unable to load stakeholder accounts for admin dashboard.", error);
    return [];
  }
}
