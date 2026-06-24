//app/actions/survey.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { ZodError } from 'zod';
import { requireAnyRole } from '@/lib/auth/guards';
import {
  closeSurveyForProfile,
  createSurveyForProfile,
  submitSurveyResponseForStakeholder,
} from '@/lib/services/survey-service';
import {
  createSurveyInputFromFormData,
  surveyResponseInputFromFormData,
} from '@/lib/validation/survey';
import { revalidateSurveyViews } from '@/lib/revalidation';

type SurveyActionState = { error?: string; success?: boolean; message?: string } | null;

function validationErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? 'Invalid form data';
  }

  if (error instanceof Error && error.message === 'Invalid questions format') {
    return error.message;
  }

  return 'Invalid form data';
}

export async function createSurvey(
  prevState: SurveyActionState,
  formData: FormData
): Promise<SurveyActionState> {
  try {
    const auth = await requireAnyRole(['office', 'admin']);
    if (!auth.ok) return { error: auth.error };

    const input = createSurveyInputFromFormData(formData);
    const result = await createSurveyForProfile(auth.profile, input);
    if (result.error) return { error: result.error };

    revalidateSurveyViews();
    return { success: true, message: 'Survey created and published successfully' };
  } catch (error) {
    if (error instanceof ZodError || error instanceof Error) {
      return { error: validationErrorMessage(error) };
    }
    return { error: 'An unexpected error occurred' };
  }
}

type ResponseActionState = { error?: string; success?: boolean } | null;

export async function submitSurveyResponse(
  prevState: ResponseActionState,
  formData: FormData
): Promise<ResponseActionState> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Unauthorized' };

    const input = surveyResponseInputFromFormData(formData);
    const result = await submitSurveyResponseForStakeholder(user.id, input);
    if (result.error) return { error: result.error };

    revalidateSurveyViews(input.survey_id);
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError || error instanceof Error) {
      return { error: validationErrorMessage(error) };
    }
    return { error: 'An unexpected error occurred' };
  }
}

export async function closeSurvey(surveyId: string) {
  try {
    const auth = await requireAnyRole(['office', 'admin']);
    if (!auth.ok) return { error: auth.error };

    const result = await closeSurveyForProfile(auth.profile, surveyId);
    if (result.error) return { error: result.error };

    revalidateSurveyViews(surveyId);
    return { success: true };
  } catch {
    return { error: 'An unexpected error occurred' };
  }
}
