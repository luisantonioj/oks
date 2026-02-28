'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createHelpRequest(formData: FormData) {
  const supabase = await createClient();
  
  // 1. Verify the user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  // 2. Extract data
  const location = formData.get('location') as string;
  const notes = formData.get('notes') as string;
  const crisis_id = formData.get('crisis_id') as string;

  // 3. Insert into database
  const { error } = await supabase
    .from('help_request')
    .insert({
      stakeholder_id: user.id, // Automatically link to the logged-in user
      crisis_id,
      location,
      notes,
      status: 'pending' // Default status [cite: 2433]
    });

  if (error) {
    console.error('Failed to create help request:', error);
    return { error: 'Failed to submit request' };
  }

  // 4. Tell Next.js to refresh the dashboard data
  revalidatePath('/stakeholder/dashboard');
  return { success: true };
}