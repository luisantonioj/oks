//app/actions/help-request.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { ZodError } from 'zod';
import { requireAnyRole } from '@/lib/auth/guards';
import {
  createHelpRequestForStakeholder,
  updateHelpRequestStatusForProfile,
} from '@/lib/services/help-request-service';
import {
  helpRequestInputFromFormData,
  helpRequestStatusSchema,
} from '@/lib/validation/help-request';
import { revalidateHelpRequestViews, revalidateInboxViews } from '@/lib/revalidation';

type HelpRequestState = { error?: string; success?: boolean; message?: string } | null;

function validationErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? 'Invalid form data';
  }

  return 'Invalid form data';
}

export async function createHelpRequest(
  prevState: HelpRequestState,
  formData: FormData
): Promise<HelpRequestState> {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Unauthorized' };

    const input = helpRequestInputFromFormData(formData);
    const result = await createHelpRequestForStakeholder(user.id, input);
    if (result.error) return { error: result.error };

    revalidateHelpRequestViews();
    return { success: true, message: 'Help request submitted successfully' };
  } catch (error) {
    console.error('Unexpected error in createHelpRequest:', error);
    if (error instanceof ZodError) {
      return { error: validationErrorMessage(error) };
    }
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateHelpRequestStatus(id: string, status: 'pending' | 'resolved', office_id?: string) {
  try {
    const auth = await requireAnyRole(['office', 'admin']);
    if (!auth.ok) return { error: auth.error };

    const parsedStatus = helpRequestStatusSchema.parse(status);
    const result = await updateHelpRequestStatusForProfile(auth.profile, id, parsedStatus, office_id);
    if (result.error) return { error: result.error };

    revalidateHelpRequestViews();
    revalidateInboxViews();
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: validationErrorMessage(error) };
    }
    return { error: 'An unexpected error occurred' };
  }
}
