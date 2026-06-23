// lib/queries/user.ts
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { UserProfile, UserRole } from '@/types/user';

// Get current authenticated user with role information
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('[getCurrentUserProfile] Auth error:', userError);
      return null;
    }

    if (!user) {
      return null;
    }

    // Try to get role from app_metadata first (fast)
    let role = user.app_metadata?.role as UserRole | undefined;

    // Fallback: query from stakeholder table if metadata missing
    if (!role) {
      const [shRes, officeRes] = await Promise.all([
        supabase.from('stakeholder').select('role').eq('id', user.id).maybeSingle(),
        supabase.from('office').select('role').eq('id', user.id).maybeSingle(),
      ]);

      if (!shRes.error && shRes.data?.role) {
        role = shRes.data.role as UserRole;
      } else if (!officeRes.error && officeRes.data?.role) {
        role = officeRes.data.role as UserRole;
      }
    }

    if (!role) {
      console.error('[getCurrentUserProfile] No role found in metadata or tables');
      return null;
    }

    // Now proceed with full profile fetch based on role
    switch (role) {
      case 'admin': {
        return {
          id: user.id,
          email: user.email ?? '',
          role: 'admin',
          name: 'Administrator',
          created_at: user.created_at ?? new Date().toISOString(),
          updated_at: user.updated_at ?? new Date().toISOString(),
        } as UserProfile;
      }

      case 'office': {
        const { data, error } = await supabase
          .from('office')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('[getCurrentUserProfile] Office profile fetch error:', error);
          return null;
        }
        
        if (!data) {
          console.error('[getCurrentUserProfile] Office profile not found');
          return null;
        }
        
        return { ...data, role: 'office' } as UserProfile;
      }

      case 'stakeholder': {
        const { data, error } = await supabase
          .from('stakeholder')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('[getCurrentUserProfile] Stakeholder profile fetch error:', error);
          return null;
        }
        
        if (!data) {
          console.error('[getCurrentUserProfile] Stakeholder profile not found');
          return null;
        }
        
        return { ...data, role: 'stakeholder' } as UserProfile;
      }

      default:
        console.error('[getCurrentUserProfile] Unknown role:', role);
        return null;
    }
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
