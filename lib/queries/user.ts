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
      console.log('[getCurrentUserProfile] No authenticated user');
      return null;
    }

    console.log('[getCurrentUserProfile] User ID:', user.id);
    console.log('[getCurrentUserProfile] User email:', user.email);
    console.log('[getCurrentUserProfile] App metadata:', user.app_metadata);

    // Try to get role from app_metadata first (fast)
    let role = user.app_metadata?.role as UserRole | undefined;

    // Fallback: query from stakeholder table if metadata missing
    if (!role) {
      console.log('[getCurrentUserProfile] Role missing in metadata, checking tables...');
      
      // Check stakeholder table
      const { data: shData, error: shError } = await supabase
        .from('stakeholder')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (!shError && shData?.role) {
        role = shData.role as UserRole;
        console.log('[getCurrentUserProfile] Role found in stakeholder table:', role);
      } else {
        console.log('[getCurrentUserProfile] Not in stakeholder table, checking office table...');
        
        // Check office table
        const { data: officeData, error: officeError } = await supabase
          .from('office')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (!officeError && officeData?.role) {
          role = officeData.role as UserRole;
          console.log('[getCurrentUserProfile] Role found in office table:', role);
        }
      }
    }

    if (!role) {
      console.error('[getCurrentUserProfile] No role found in metadata or tables');
      return null;
    }

    // Now proceed with full profile fetch based on role
    switch (role) {
      case 'admin': {
        console.log('[getCurrentUserProfile] Returning admin profile');
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
        console.log('[getCurrentUserProfile] Fetching office profile');
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
        
        console.log('[getCurrentUserProfile] Office profile found:', data.office_name);
        return { ...data, role: 'office' } as UserProfile;
      }

      case 'stakeholder': {
        console.log('[getCurrentUserProfile] Fetching stakeholder profile');
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
        
        console.log('[getCurrentUserProfile] Stakeholder profile found:', data.name);
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

// Admin-only: Get all offices
export async function getAllOffices() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin only');
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('office')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// Admin-only: Get all stakeholders
export async function getAllStakeholders() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin only');
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('stakeholder')
    .select('*')
    .order('created_at', { ascending: false });

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