'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function sendMessage(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Unauthorized' };

    const help_request_id = formData.get('help_request_id') as string;
    const content = formData.get('content') as string;
    const sender_role = formData.get('sender_role') as string;

    if (!help_request_id || !content?.trim()) {
      return { error: 'Message content is required' };
    }

    const { error } = await supabase
      .from('message')
      .insert({
        help_request_id,
        sender_id: user.id,
        sender_role,
        content: content.trim(),
      });

    if (error) return { error: error.message };

    revalidatePath(`/stakeholder/inbox/${help_request_id}`);
    revalidatePath(`/office/inbox/${help_request_id}`);
    return { success: true };
  } catch {
    return { error: 'An unexpected error occurred' };
  }
}