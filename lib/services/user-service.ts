import { getCurrentUserProfile } from "@/lib/queries/user";
import { logAction } from "@/lib/services/audit-service";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { CreateOfficeInput, StakeholderSignupInput } from "@/lib/validation/auth";
import { UserProfile } from "@/types/user";

type ServiceResult =
  | { error?: never; success: true; message?: string }
  | { error: string; success?: never; message?: never };

export async function updateCurrentUserProfile(
  updates: Partial<Omit<UserProfile, "id" | "role" | "email" | "created_at">>,
): Promise<UserProfile | { error: string }> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { error: "No authenticated user" };

  const supabase = await createClient();

  const table = profile.role === "office" ? "office" : "stakeholder";
  if (profile.role === "admin") return { error: "Admin profile cannot be updated" };

  const { data, error } = await supabase
    .from(table)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", profile.id)
    .select()
    .single();

  if (error) return { error: error.message };
  return { ...data, role: profile.role } as UserProfile;
}

export async function createStakeholderAccount(input: StakeholderSignupInput): Promise<ServiceResult> {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback`,
      data: { name: input.name },
    },
  });

  if (signUpError || !authData.user) {
    return { error: signUpError?.message || "Signup failed" };
  }

  const userId = authData.user.id;

  const { error: metadataError } = await adminClient.auth.admin.updateUserById(userId, {
    app_metadata: { role: "stakeholder" },
  });

  if (metadataError) {
    await adminClient.auth.admin.deleteUser(userId);
    return { error: "Failed to set user role" };
  }

  const { error: insertError } = await adminClient.from("stakeholder").insert({
    id: userId,
    name: input.name,
    email: input.email,
    role: "stakeholder",
    age: input.age,
    community: input.community,
    contact: input.contact,
    permanent_address: input.permanentAddress,
    current_address: input.currentAddress,
  });

  if (insertError) {
    await adminClient.auth.admin.deleteUser(userId);
    return { error: insertError.message || "Profile creation failed" };
  }

  void logAction({
    actor_id: userId,
    actor_role: "stakeholder",
    actor_name: input.name,
    action: "STAKEHOLDER_SIGNUP",
    entity_type: "stakeholder",
    entity_id: userId,
  });

  return {
    success: true,
    message: "Account created! Please check your email to confirm.",
  };
}

export async function createOfficeAccountForAdmin(
  adminProfile: UserProfile,
  input: CreateOfficeInput,
): Promise<ServiceResult> {
  if (adminProfile.role !== "admin") {
    return { error: "Unauthorized: Admin only" };
  }

  const adminClient = createAdminClient();

  const { data: authData, error: signUpError } = await adminClient.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { name: input.name },
    app_metadata: { role: "office" },
  });

  if (signUpError || !authData.user) {
    console.error("[createOfficeAccountForAdmin] Auth creation error:", signUpError);
    return { error: signUpError?.message || "Failed to create user account" };
  }

  const userId = authData.user.id;

  const { error: insertError } = await adminClient.from("office").insert({
    id: userId,
    name: input.name,
    email: input.email,
    role: "office",
    office_name: input.officeName,
    age: input.age,
    gender: input.gender,
    contact: input.contact,
  });

  if (insertError) {
    console.error("[createOfficeAccountForAdmin] Profile insert error:", insertError);
    await adminClient.auth.admin.deleteUser(userId);
    return { error: insertError.message || "Failed to create office profile" };
  }

  void logAction({
    actor_id: adminProfile.id,
    actor_role: adminProfile.role,
    action: "CREATE_OFFICE_ACCOUNT",
    entity_type: "office",
    entity_id: userId,
    metadata: { office_name: input.officeName, email: input.email },
  });

  return {
    success: true,
    message: `Office account created successfully for ${input.name} (${input.officeName})`,
  };
}

export async function deleteUser(targetId?: string): Promise<{ success: boolean; error?: string }> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { success: false, error: "No authenticated user" };

  const isSelf = !targetId || targetId === profile.id;
  const isAdmin = profile.role === "admin";

  if (!isSelf && !isAdmin) return { success: false, error: "Unauthorized" };
  if (isAdmin && !targetId) return { success: false, error: "Target ID required for admin delete" };

  const idToDelete = isSelf ? profile.id : targetId!;

  if (profile.role === "admin" && isSelf) {
    return { success: false, error: "Cannot delete admin account" };
  }

  const adminSupabase = createAdminClient();

  let targetTable: "office" | "stakeholder";

  if (isSelf) {
    targetTable = profile.role === "office" ? "office" : "stakeholder";
  } else {
    const { data: officeData } = await adminSupabase
      .from("office")
      .select("id")
      .eq("id", idToDelete)
      .maybeSingle();

    if (officeData) {
      targetTable = "office";
    } else {
      targetTable = "stakeholder";
      const { data: stakeholderData } = await adminSupabase
        .from("stakeholder")
        .select("id")
        .eq("id", idToDelete)
        .maybeSingle();

      if (!stakeholderData) {
        return { success: false, error: "Target profile not found" };
      }
    }
  }

  await adminSupabase.from(targetTable).delete().eq("id", idToDelete);

  const { error } = await adminSupabase.auth.admin.deleteUser(idToDelete);

  if (error) return { success: false, error: error.message };

  if (isSelf) {
    const userSupabase = await createClient();
    await userSupabase.auth.signOut();
  }

  return { success: true };
}
