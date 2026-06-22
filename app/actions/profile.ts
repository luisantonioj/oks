// app/actions/profile.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateOfficeProfile(formData: {
  name: string;
  age: number | null;
  gender: string;
  contact: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return { error: 'Unauthorized' };

    const { error } = await supabase
      .from('office')
      .update({
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        contact: formData.contact,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      console.error('Failed to update profile:', error);
      return { error: error.message || 'Failed to update profile' };
    }

    // Refresh the profile page so the new data shows instantly
    revalidatePath('/office/profile');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error in updateOfficeProfile:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateStakeholderProfile(formData: {
  name: string;
  age: number | null;
  contact: string;
  permanent_address: string;
  current_address: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return { error: 'Unauthorized' };

    const { error } = await supabase
      .from('stakeholder')
      .update({
        name: formData.name,
        age: formData.age,
        contact: formData.contact,
        permanent_address: formData.permanent_address,
        current_address: formData.current_address,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      console.error('Failed to update stakeholder profile:', error);
      return { error: error.message || 'Failed to update profile' };
    }

    revalidatePath('/stakeholder/profile');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error in updateStakeholderProfile:', error);
    return { error: 'An unexpected error occurred' };
  }
}