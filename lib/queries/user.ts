// lib/queries/user.ts
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { UserProfile, UserRole } from '@/types/user';
import { cookies } from 'next/headers';

// Get current authenticated user with role information
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return null;

    // 1. Check Pure Admin first
    const { data: admin } = await supabase.from("admin").select("*").eq("id", user.id).maybeSingle();
    if (admin) return { ...admin, role: "admin" } as UserProfile;

    // 2. Check Office (Returns is_admin flag too)
    const { data: office } = await supabase.from("office").select("*").eq("id", user.id).maybeSingle();
    if (office) return { ...office, role: "office" } as UserProfile;

    // 3. Check Stakeholder
    const { data: stakeholder } = await supabase.from("stakeholder").select("*").eq("id", user.id).maybeSingle();
    if (stakeholder) return { ...stakeholder, role: "stakeholder" } as UserProfile;

    return null;
  } catch (error) {
    console.error('[getCurrentUserProfile] Unexpected error:', error);
    return null;
  }
}

// Update own profile (RLS will enforce ownership)
export async function updateCurrentUserProfile(
  updates: Partial<Omit<UserProfile, 'id' | 'role' | 'email' | 'created_at'>>
): Promise<UserProfile | { error: string }> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { error: 'No authenticated user' };

  const supabase = await createClient();

  const table = profile.role === 'office' ? 'office' : 'stakeholder';
  if (profile.role === 'admin') return { error: 'Admin profile cannot be updated' };

  const { data, error } = await supabase
    .from(table)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', profile.id)
    .select()
    .single();

  if (error) return { error: error.message };
  return { ...data, role: profile.role } as UserProfile;
}

// Get stakeholder profile by ID
export async function getStakeholderProfile(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('stakeholder')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Get office profile by ID
export async function getOfficeProfile(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('office')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Admin-only: Get all offices
export async function getAllOffices() {
  const profile = await getCurrentUserProfile();
  
  // Security: Must be a Pure Admin OR an Office with Admin rights
  if (!profile || (profile.role !== "admin" && !(profile as any).is_admin)) {
    throw new Error("Unauthorized: Admin only");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("office").select("*").order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// Admin-only: Get all stakeholders
export async function getAllStakeholders() {
  const profile = await getCurrentUserProfile();
  
  // Security: Must be a Pure Admin OR an Office with Admin rights
  if (!profile || (profile.role !== "admin" && !(profile as any).is_admin)) {
    throw new Error("Unauthorized: Admin only");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("stakeholder").select("*").order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// Delete user (self-delete for office/stakeholder; admin can delete others)
export async function deleteUser(targetId?: string): Promise<{ success: boolean; error?: string }> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { success: false, error: 'No authenticated user' };

  const isSelf = !targetId || targetId === profile.id;
  const isAdmin = profile.role === 'admin';

  if (!isSelf && !isAdmin) return { success: false, error: 'Unauthorized' };
  if (isAdmin && !targetId) return { success: false, error: 'Target ID required for admin delete' };

  const idToDelete = isSelf ? profile.id : targetId!;

  // Prevent deleting admin
  if (profile.role === 'admin' && isSelf) {
    return { success: false, error: 'Cannot delete admin account' };
  }

  const adminSupabase = createAdminClient();

  // Determine which table to delete from
  let targetTable: 'office' | 'stakeholder';

  if (isSelf) {
    targetTable = profile.role === 'office' ? 'office' : 'stakeholder';
  } else {
    // Admin delete: check which table the user is in
    const { data: officeData } = await adminSupabase
      .from('office')
      .select('id')
      .eq('id', idToDelete)
      .maybeSingle();

    if (officeData) {
      targetTable = 'office';
    } else {
      targetTable = 'stakeholder';
      const { data: stakeholderData } = await adminSupabase
        .from('stakeholder')
        .select('id')
        .eq('id', idToDelete)
        .maybeSingle();
      
      if (!stakeholderData) {
        return { success: false, error: 'Target profile not found' };
      }
    }
  }

  // Delete from profile table
  await adminSupabase.from(targetTable).delete().eq('id', idToDelete);

  // Delete auth user
  const { error } = await adminSupabase.auth.admin.deleteUser(idToDelete);

  if (error) return { success: false, error: error.message };

  // If self-delete, sign out
  if (isSelf) {
    const userSupabase = await createClient();
    await userSupabase.auth.signOut();
  }

  return { success: true };
}