'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

type SurveyActionState = { error?: string; success?: boolean; message?: string } | null;

export async function createSurvey(
  prevState: SurveyActionState,
  formData: FormData
): Promise<SurveyActionState> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Unauthorized' };

    const title = formData.get('title') as string;
    const crisis_id = formData.get('crisis_id') as string;
    const questionsRaw = formData.get('questions') as string;

    if (!title || !crisis_id || !questionsRaw) return { error: 'Title, crisis, and questions are required' };

    let questions;
    try {
      questions = JSON.parse(questionsRaw);
    } catch {
      return { error: 'Invalid questions format' };
    }

    const validQuestions = questions.filter((q: { text: string }) => q.text?.trim());
    if (validQuestions.length === 0) return { error: 'At least one question with text is required' };

    const { error } = await supabase.from('survey').insert({
      title,
      crisis_id,
      questions: JSON.stringify(validQuestions),
      office_id: user.id,
      status: 'active',
    });

    if (error) return { error: error.message || 'Failed to create survey' };

    revalidatePath('/office/surveys');
    revalidatePath('/stakeholder/surveys');
    return { success: true, message: 'Survey created and published successfully' };
  } catch {
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

    const survey_id = formData.get('survey_id') as string;
    if (!survey_id) return { error: 'Survey ID is required' };

    const { data: existing } = await supabase
      .from('survey_response')
      .select('id')
      .eq('survey_id', survey_id)
      .eq('stakeholder_id', user.id)
      .maybeSingle();

    if (existing) return { error: 'You have already responded to this survey' };

    const answers: Record<string, string | string[]> = {};
    formData.forEach((value, key) => {
      if (key.startsWith('q_')) {
        const questionId = key.replace('q_', '');
        const existing = answers[questionId];
        if (existing) {
          answers[questionId] = Array.isArray(existing)
            ? [...existing, value as string]
            : [existing as string, value as string];
        } else {
          answers[questionId] = value as string;
        }
      }
    });

    const { error } = await supabase.from('survey_response').insert({
      survey_id,
      stakeholder_id: user.id,
      answers: JSON.stringify(answers),
    });

    if (error) return { error: error.message || 'Failed to submit response' };

    revalidatePath('/stakeholder/surveys');
    revalidatePath(`/stakeholder/surveys/${survey_id}`);
    return { success: true };
  } catch {
    return { error: 'An unexpected error occurred' };
  }
}

export async function closeSurvey(surveyId: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('survey').update({ status: 'closed' }).eq('id', surveyId);
    if (error) return { error: error.message };
    revalidatePath('/office/surveys');
    revalidatePath(`/office/surveys/${surveyId}`);
    return { success: true };
  } catch {
    return { error: 'An unexpected error occurred' };
  }
}