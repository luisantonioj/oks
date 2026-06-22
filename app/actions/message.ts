'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function sendMessage(formData: FormData) {
  const help_request_id = formData.get('help_request_id') as string;
  const content = formData.get('content') as string;
  const sender_role = formData.get('sender_role') as string;

  if (!content || !help_request_id || !sender_role) {
    return { error: 'Message cannot be empty.' };
  }

  const supabase = await createClient();

  // 1. Get the current authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized.' };
  }

  // 1.5 Verify authorization: if stakeholder, must own the help request
  const { data: helpRequest, error: reqError } = await supabase
    .from('help_request')
    .select('stakeholder_id')
    .eq('id', help_request_id)
    .single();

  if (reqError || !helpRequest) {
    return { error: 'Help request not found.' };
  }

  const userRole = user.app_metadata?.role;
  if (userRole === 'stakeholder' && helpRequest.stakeholder_id !== user.id) {
    return { error: 'Unauthorized.' };
  }

  let sender_name: string | undefined;
    if (sender_role === 'office') {
      const { data: office } = await supabase
        .from('office')
        .select('office_name')
        .eq('id', user.id)
        .single();
      sender_name = office?.office_name ?? undefined;
    } else {
      const { data: stakeholder } = await supabase
        .from('stakeholder')
        .select('name')
        .eq('id', user.id)
        .single();
      sender_name = stakeholder?.name ?? undefined;
    }

  // 2. Insert the message into the database
  const { error } = await supabase
    .from('message')
    .insert({
      help_request_id,
      sender_id: user.id,
      sender_role,
      sender_name,
      content,
    });

  if (error) {
    console.error('Error sending message:', error.message);
    return { error: 'Failed to send message. Please try again.' };
  }

  // 3. Revalidate the paths so both Office and Stakeholder see the new message instantly
  revalidatePath(`/office/inbox/${help_request_id}`);
  revalidatePath(`/stakeholder/inbox/${help_request_id}`);
  // Also refresh the main inbox to update the "Last Message" snippet
  revalidatePath('/office/inbox');
  revalidatePath('/stakeholder/inbox');

  return { success: true };
}