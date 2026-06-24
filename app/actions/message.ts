'use server';

import { requireAnyRole } from '@/lib/auth/guards';
import { sendMessageForProfile } from '@/lib/services/message-service';
import { revalidatePath } from 'next/cache';

export async function sendMessage(formData: FormData) {
  const auth = await requireAnyRole(['office', 'stakeholder']);
  if (!auth.ok) return { error: auth.error };

  const input = {
    help_request_id: formData.get('help_request_id') as string,
    content: formData.get('content') as string,
    sender_role: formData.get('sender_role') as string,
  };

  const result = await sendMessageForProfile(auth.profile, input);
  if (result.error) return { error: result.error };

  revalidatePath(`/office/inbox/${input.help_request_id}`);
  revalidatePath(`/stakeholder/inbox/${input.help_request_id}`);
  revalidatePath('/office/inbox');
  revalidatePath('/stakeholder/inbox');

  return { success: true };
}
