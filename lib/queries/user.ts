// lib/queries/user.ts
import { createClient } from '@/lib/supabase/server';
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

