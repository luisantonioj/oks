//lib/queries/survey.ts
import { createClient } from '@/lib/supabase/server';
import { Survey, SurveyAnswers, SurveyQuestion, SurveyResponse, SurveyStatus } from '@/types/database';

type SurveyResponseWithContextRow = {
  id: string;
  survey_id: string;
  stakeholder_id: string;
  answers: string;
  created_at: string;
  survey?: { questions?: string | SurveyQuestion[] | null } | null;
  stakeholder?: { name?: string | null } | null;
};

export interface VolunteerResponseEntry {
  id: string;
  survey_id: string;
  stakeholder_id: string;
  stakeholder_name: string;
  answers: SurveyAnswers;
  created_at: string;
  questions: SurveyQuestion[];
}

export async function getSurveys(filters?: {
  crisis_id?: string;
  status?: SurveyStatus;
  office_id?: string;
}): Promise<Survey[]> {
  const supabase = await createClient();
  let query = supabase.from('survey').select('*').order('created_at', { ascending: false });
  if (filters?.crisis_id) query = query.eq('crisis_id', filters.crisis_id);
  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.office_id) query = query.eq('office_id', filters.office_id);
  const { data, error } = await query;
  if (error) { console.error('Error fetching surveys:', error); return []; }
  return data || [];
}

export async function getSurveyById(id: string): Promise<Survey | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('survey').select('*').eq('id', id).single();
  if (error) { console.error('Error fetching survey:', error); return null; }
  return data;
}

export async function getSurveyResponses(surveyId: string): Promise<SurveyResponse[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('survey_response').select('*').eq('survey_id', surveyId).order('created_at', { ascending: false });
  if (error) { console.error('Error fetching survey responses:', error); return []; }
  return data || [];
}

export async function getStakeholderSurveyResponse(surveyId: string, stakeholderId: string): Promise<SurveyResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('survey_response').select('*').eq('survey_id', surveyId).eq('stakeholder_id', stakeholderId).maybeSingle();
  if (error) { console.error('Error fetching stakeholder survey response:', error); return null; }
  return data;
}

export async function getSurveyResponseCountMap(surveyIds: string[]): Promise<Record<string, number>> {
  if (surveyIds.length === 0) return {};
  const supabase = await createClient();
  const { data, error } = await supabase.from('survey_response').select('survey_id').in('survey_id', surveyIds);
  if (error) { console.error('Error fetching survey response counts:', error); return {}; }
  return (data || []).reduce((acc: Record<string, number>, row) => {
    acc[row.survey_id] = (acc[row.survey_id] || 0) + 1;
    return acc;
  }, {});
}

export async function getStakeholderRespondedSurveyIds(stakeholderId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('survey_response').select('survey_id').eq('stakeholder_id', stakeholderId);
  if (error) { console.error('Error fetching responded surveys:', error); return []; }
  return (data || []).map((r) => r.survey_id);
}

function parseJson<T>(raw: unknown, fallback: T): T {
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : (raw as T) ?? fallback;
  } catch {
    return fallback;
  }
}

export interface DonationResponseEntry {
  id: string;
  survey_id: string;
  stakeholder_id: string;
  stakeholder_name: string;
  answers: SurveyAnswers;
  created_at: string;
  questions: SurveyQuestion[];
}

export async function getDonationResponsesForCrisis(crisisId: string): Promise<DonationResponseEntry[]> {
  const supabase = await createClient();

  const { data: responses, error } = await supabase
    .from('survey_response')
    .select(`
      id,
      survey_id,
      stakeholder_id,
      answers,
      created_at,
      survey!inner(id, questions, crisis_id, survey_type),
      stakeholder(name)
    `)
    .eq('survey.crisis_id', crisisId)
    .eq('survey.survey_type', 'donation')
    .order('created_at', { ascending: false });

  if (error || !responses || responses.length === 0) return [];

  const rows = responses as SurveyResponseWithContextRow[];

  return rows.map((r) => {
    const answers = parseJson<SurveyAnswers>(r.answers, {});
    const resolvedName = (answers['__stake_name'] as string) || r.stakeholder?.name || 'Unknown';
    const questions = parseJson<SurveyQuestion[]>(r.survey?.questions, []);
    return {
      id: r.id,
      survey_id: r.survey_id,
      stakeholder_id: r.stakeholder_id,
      stakeholder_name: resolvedName,
      answers,
      created_at: r.created_at,
      questions,
    };
  });
}

export async function getVolunteerResponsesForCrisis(crisisId: string): Promise<VolunteerResponseEntry[]> {
  const supabase = await createClient();

  const { data: responses, error } = await supabase
    .from('survey_response')
    .select(`
      id,
      survey_id,
      stakeholder_id,
      answers,
      created_at,
      survey!inner(id, questions, crisis_id, survey_type),
      stakeholder(name)
    `)
    .eq('survey.crisis_id', crisisId)
    .eq('survey.survey_type', 'volunteer')
    .order('created_at', { ascending: false });

  if (error || !responses || responses.length === 0) return [];

  const rows = responses as SurveyResponseWithContextRow[];

  return rows.map((r) => {
    const answers = parseJson<SurveyAnswers>(r.answers, {});
    const resolvedName = (answers['__stake_name'] as string) || r.stakeholder?.name || 'Unknown';
    const questions = parseJson<SurveyQuestion[]>(r.survey?.questions, []);
    return {
      id: r.id,
      survey_id: r.survey_id,
      stakeholder_id: r.stakeholder_id,
      stakeholder_name: resolvedName,
      answers,
      created_at: r.created_at,
      questions,
    };
  });
}
