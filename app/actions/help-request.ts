'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createHelpRequest(formData: FormData) {
  try {
    const supabase = await createClient();
    
    // 1. Verify the stakeholder is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Unauthorized' };

    // 2. Extract data
    const location = formData.get('location') as string;
    const notes = formData.get('notes') as string;
    const crisis_id = formData.get('crisis_id') as string;

    if (!location || !crisis_id) {
      return { error: 'Location and Crisis ID are required' };
    }

    // 3. Insert into database
    const { error } = await supabase
      .from('help_request')
      .insert({
        stakeholder_id: user.id, // Automatically link to the logged-in stakeholder
        crisis_id,
        location,
        notes,
        status: 'pending'
      });

    if (error) {
      console.error('Failed to create help request:', error);
      return { error: error.message || 'Failed to submit request' };
    }

    // 4. Refresh stakeholder dashboard to show the new request
    revalidatePath('/stakeholder/dashboard');
    return { success: true, message: 'Help request submitted successfully' };
  } catch (error) {
    console.error('Unexpected error in createHelpRequest:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateHelpRequestStatus(id: string, status: 'pending' | 'resolved', office_id?: string) {
  try {
    const supabase = await createClient();
    
    // Prepare update payload. If an office is handling it, assign their ID.
    const updateData: { status: string; office_id?: string } = { status };
    if (office_id) {
      updateData.office_id = office_id;
    }

    const { error } = await supabase
      .from('help_request')
      .update(updateData)
      .eq('id', id);

    if (error) return { error: error.message };

    // Refresh dashboards so offices see the updated status
    revalidatePath('/office/dashboard');
    revalidatePath('/portal/dashboard');
    return { success: true };
  } catch (error) {
    return { error: 'An unexpected error occurred' };
  }
}