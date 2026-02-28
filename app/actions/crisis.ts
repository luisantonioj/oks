'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createCrisis(formData: FormData) {
  try {
    const supabase = await createClient();
    
    // Verify the user is authenticated (Office or Admin)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Unauthorized' };

    // Extract data from the form
    const type = formData.get('type') as string;
    const summary = formData.get('summary') as string;
    const affected_areas = formData.get('affected_areas') as string;
    const severity = formData.get('severity') as string;

    // Insert into the crisis table
    const { error } = await supabase
      .from('crisis')
      .insert({
        type,
        summary,
        affected_areas,
        severity,
        status: 'active', // New crises start as active
        office_id: user.id // The ID of the office creating the crisis
      });

    if (error) {
      console.error('Failed to create crisis:', error);
      return { error: error.message || 'Failed to create crisis' };
    }

    // Refresh dashboards to show the new crisis
    revalidatePath('/office/dashboard');
    revalidatePath('/admin/dashboard');
    revalidatePath('/stakeholder/dashboard');
    
    return { success: true, message: 'Crisis created successfully' };
  } catch (error) {
    console.error('Unexpected error in createCrisis:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateCrisisStatus(id: string, status: 'active' | 'resolved') {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('crisis')
      .update({ status })
      .eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/office/dashboard');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    return { error: 'An unexpected error occurred' };
  }
}