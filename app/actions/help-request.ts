//app/actions/help-request.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logAction } from '@/lib/queries/audit';

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
    const crisis_id = formData.get('crisis_id') as string;
    const notes = formData.get('notes') as string;

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
        status: 'pending',
      });

    if (error) {
      console.error('Failed to create help request:', error);
      return { error: error.message || 'Failed to submit request' };
    }

    void logAction({ actor_id: user.id, actor_role: 'stakeholder', action: 'SUBMIT_HELP_REQUEST', entity_type: 'help_request', metadata: { crisis_id, location } });

    revalidatePath('/stakeholder/help-requests');
    revalidatePath('/stakeholder/inbox');
    revalidatePath('/office/inbox');
    revalidatePath('/office/dashboard');
    revalidatePath('/office/help-requests');
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
    if (office_id) updateData.office_id = office_id;

    const { error } = await supabase
      .from('help_request')
      .update(updateData)
      .eq('id', id);

    if (error) return { error: error.message };

    const { data: { user } } = await supabase.auth.getUser();
    if (user) void logAction({ actor_id: user.id, actor_role: 'office', action: 'UPDATE_HELP_REQUEST_STATUS', entity_type: 'help_request', entity_id: id, metadata: { status } });

    revalidatePath('/office/dashboard');
    revalidatePath('/office/inbox');
    revalidatePath('/stakeholder/inbox');
    return { success: true };
  } catch (error) {
    return { error: 'An unexpected error occurred' };
  }
}