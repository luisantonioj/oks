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