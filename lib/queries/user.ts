// lib/queries/user.ts
import { createClient } from '@/lib/supabase/server'; // anon/auth client
import { createAdminClient } from '@/lib/supabase/admin'; // ← NEW: service_role client
import { Office, Stakeholder } from '@/types/database';
import { UserProfile, UserRole } from '@/types/user';

// Helper: Get authenticated Supabase client (for normal queries)
async function getAuthClient() {
  return await createClient(); // uses cookies/session
}

// Helper: Get admin client (service_role) for privileged ops
async function getAdminClient() {
  return await createAdminClient(); // implements service_role key
}

// 1. Fetch current user's unified profile
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = await getAuthClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const role = user.app_metadata?.role as UserRole | undefined;
  if (!role) return null;

  switch (role) {
    case 'admin': {
      return {
        id: user.id,
        email: user.email ?? '',
        role: 'admin',
        name: 'Admin',
        created_at: user.created_at ?? new Date().toISOString(),
        updated_at: user.updated_at ?? new Date().toISOString(),
      } as UserProfile;
    }

    case 'office': {
      const { data, error: err } = await supabase
        .from('offices')
        .select('*')
        .eq('id', user.id)
        .single();
      if (err || !data) return null;
      return { ...data, role: 'office' } as UserProfile;
    }

    case 'stakeholder': {
      const { data, error: err } = await supabase
        .from('stakeholders')
        .select('*')
        .eq('id', user.id)
        .single();
      if (err || !data) return null;
      return { ...data, role: 'stakeholder' } as UserProfile;
    }

    default:
      return null;
  }
}

// 2. Update own profile (RLS will enforce ownership)
export async function updateCurrentUserProfile(
  updates: Partial<Omit<UserProfile, 'id' | 'role' | 'email' | 'created_at' | 'updated_at'>>
): Promise<UserProfile | { error: string }> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { error: 'No authenticated user' };

  const supabase = await getAuthClient();

  let table = profile.role === 'office' ? 'offices' : 'stakeholders';
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

// 3. Delete user (self-delete for office/stakeholder; admin can delete others)
export async function deleteUser(targetId?: string): Promise<{ success: boolean; error?: string }> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { success: false, error: 'No authenticated user' };

  const isSelf = !targetId || targetId === profile.id;
  const isAdmin = profile.role === 'admin';

  if (!isSelf && !isAdmin) return { success: false, error: 'Unauthorized' };
  if (isAdmin && !targetId) return { success: false, error: 'Target ID required for admin delete' };

  const idToDelete = isSelf ? profile.id : targetId!;

  // Prevent deleting fixed admin
  if (idToDelete === 'fixed-admin-id-here' /* or check email */) {
    return { success: false, error: 'Cannot delete fixed admin' };
  }

  const adminSupabase = await getAdminClient(); // service_role required!

  // Optional: Delete related data first (crises, announcements, etc.)
  // await deleteRelatedData(idToDelete);

  // Delete from profile table
  let targetTable: 'offices' | 'stakeholders';

  if (isSelf) {
    targetTable = profile.role === 'office' ? 'offices' : 'stakeholders';
  } else {
  // Admin delete: determine table by checking existence (simple & safe)
  const { data: officeData } = await adminSupabase
      .from('offices')
      .select('id')
      .eq('id', idToDelete)
      .maybeSingle();  // .maybeSingle() returns null if not found, no error

  if (officeData) {
      targetTable = 'offices';
  } else {
      targetTable = 'stakeholders'; // assume or add check
      // Optional: verify existence
      const { data: shData } = await adminSupabase
      .from('stakeholders')
      .select('id')
      .eq('id', idToDelete)
      .maybeSingle();
      if (!shData) {
      return { success: false, error: 'Target profile not found' };
      }
    }
  }

  await adminSupabase.from(targetTable).delete().eq('id', idToDelete);

  // Delete auth user
  const { error } = await adminSupabase.auth.admin.deleteUser(idToDelete);

  if (error) return { success: false, error: error.message };

  // If self-delete, sign out
  if (isSelf) {
    await (await getAuthClient()).auth.signOut();
  }

  return { success: true };
}

// 4. Admin-only: Get all offices / stakeholders (RLS can allow if policy exists)
export async function getAllOffices(): Promise<Office[]> {
  const supabase = await getAuthClient();
  const { data, error } = await supabase.from('offices').select('*');
  if (error) throw error; // or handle
  return data ?? [];
}

// Similar for getAllStakeholders, getOfficeById, etc. (add RLS checks implicitly)
