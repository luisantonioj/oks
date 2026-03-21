'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

type HelpRequestState = { error?: string; success?: boolean; message?: string } | null;

export async function createHelpRequest(
  prevState: HelpRequestState,
  formData: FormData
): Promise<HelpRequestState> {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Unauthorized' };

    const location = formData.get('location') as string;
    const notes = formData.get('notes') as string;
    const crisis_id = formData.get('crisis_id') as string;

    if (!location || !crisis_id) {
      return { error: 'Location and Crisis ID are required' };
    }

    const { error } = await supabase
      .from('help_request')
      .insert({
        stakeholder_id: user.id,
        crisis_id,
        location,
        notes,
        status: 'pending'
      });

    if (error) {
      console.error('Failed to create help request:', error);
      return { error: error.message || 'Failed to submit request' };
    }

    revalidatePath('/stakeholder/help-requests');
    return { success: true, message: 'Help request submitted successfully' };
  } catch (error) {
    console.error('Unexpected error in createHelpRequest:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateHelpRequestStatus(id: string, status: 'pending' | 'resolved', office_id?: string) {
  try {
    const supabase = await createClient();
    
    const updateData: { status: string; office_id?: string } = { status };
    if (office_id) {
      updateData.office_id = office_id;
    }

    const { error } = await supabase
      .from('help_request')
      .update(updateData)
      .eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/office/dashboard');
    revalidatePath('/portal/dashboard');
    return { success: true };
  } catch (error) {
    return { error: 'An unexpected error occurred' };
  }
}