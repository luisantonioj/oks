// app/actions/crisis.ts
'use server';

import { redirect } from 'next/navigation';
import { ZodError } from 'zod';
import { requireAnyRole } from '@/lib/auth/guards';
import {
  createCrisisForProfile,
  deleteCrisisForProfile,
  updateCrisisForProfile,
  updateCrisisStatusForProfile,
} from '@/lib/services/crisis-service';
import {
  crisisInputFromFormData,
  crisisStatusSchema,
  crisisUpdateInputFromFormData,
} from '@/lib/validation/crisis';
import { revalidateCrisisViews } from '@/lib/revalidation';
import { routes } from '@/lib/routes';

export type CrisisActionState = {
  error?: string;
  success?: boolean;
};

function validationErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? 'Invalid form data';
  }

  return 'Invalid form data';
}

export async function createCrisis(
  prevState: CrisisActionState, 
  formData: FormData
): Promise<CrisisActionState> {
  try {
    const auth = await requireAnyRole(['office', 'admin']);
    if (!auth.ok) return { error: auth.error };

    const input = crisisInputFromFormData(formData);
    const result = await createCrisisForProfile(auth.profile, input);
    if (result.error) return { error: result.error };
    if (!result.data) return { error: 'Failed to create crisis' };

    revalidateCrisisViews();

    redirect(routes.office.crisis(result.data.id));

  } catch (error) {
    console.error('Unexpected error in createCrisis:', error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error; 
    }
    if (error instanceof ZodError) {
      return { error: validationErrorMessage(error) };
    }
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateCrisis(
  prevState: CrisisActionState, 
  formData: FormData
): Promise<CrisisActionState> {
  try {
    const auth = await requireAnyRole(['office', 'admin']);
    if (!auth.ok) return { error: auth.error };

    const input = crisisUpdateInputFromFormData(formData);
    const result = await updateCrisisForProfile(auth.profile, input);
    if (result.error) return { error: result.error };

    revalidateCrisisViews(input.id);

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: validationErrorMessage(error) };
    }
    return { error: 'An unexpected error occurred during update' };
  }
}

export async function updateCrisisStatus(id: string, status: string, resolution_notes?: string) {
  try {
    const auth = await requireAnyRole(['office', 'admin']);
    if (!auth.ok) return { error: auth.error };

    const parsedStatus = crisisStatusSchema.parse(status);
    const result = await updateCrisisStatusForProfile(auth.profile, id, parsedStatus, resolution_notes);
    if (result.error) return { error: result.error };

    revalidateCrisisViews(id);
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: validationErrorMessage(error) };
    }
    return { error: 'An unexpected error occurred' };
  }
}

export async function deleteCrisis(id: string) {
  try {
    const auth = await requireAnyRole(['office', 'admin']);
    if (!auth.ok) return { error: auth.error };

    const result = await deleteCrisisForProfile(auth.profile, id);
    if (result.error) return { error: result.error };

    revalidateCrisisViews(id);

    return { success: true };
  } catch {
    return { error: 'An unexpected error occurred while deleting' };
  }
}
