//lib/queries/survey.ts
import { createClient } from '@/lib/supabase/server';
import { Survey, SurveyAnswers, SurveyQuestion, SurveyResponse, SurveyStatus, SurveyType } from '@/types/database';
import type { Json } from '@/types/supabase';

type SurveyResponseWithContextRow = {
  id: string;
  survey_id: string | null;
  stakeholder_id: string | null;
  answers: Json;
  created_at: string | null;
  survey?: { questions?: Json } | null;
  stakeholder?: { name?: string | null } | null;
};

function stringifyJson(raw: Json): string {
  return typeof raw === 'string' ? raw : JSON.stringify(raw ?? {});
}

function normalizeSurvey(row: {
  created_at: string | null;
  crisis_id: string | null;
  id: string;
  office_id: string | null;
  questions: Json;
  status: string | null;
  survey_type: string | null;
  title: string;
  updated_at: string | null;
}): Survey {
  const createdAt = row.created_at ?? new Date().toISOString();

  return {
    ...row,
    created_at: createdAt,
    crisis_id: row.crisis_id ?? '',
    office_id: row.office_id ?? '',
    questions: stringifyJson(row.questions),
    status: row.status === 'closed' ? 'closed' : 'active',
    survey_type: ['safety', 'donation', 'volunteer'].includes(row.survey_type ?? '')
      ? (row.survey_type as SurveyType)
      : 'safety',
    updated_at: row.updated_at ?? createdAt,
  };
}

function normalizeSurveyResponse(row: {
  answers: Json;
  created_at: string | null;
  id: string;
  stakeholder_id: string | null;
  survey_id: string | null;
}): SurveyResponse {
  return {
    ...row,
    answers: stringifyJson(row.answers),
    created_at: row.created_at ?? new Date().toISOString(),
    stakeholder_id: row.stakeholder_id ?? '',
    survey_id: row.survey_id ?? '',
  };
}

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
  return (data || []).map(normalizeSurvey);
}

export async function getSurveyById(id: string): Promise<Survey | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('survey').select('*').eq('id', id).single();
  if (error) { console.error('Error fetching survey:', error); return null; }
  return normalizeSurvey(data);
}

export async function getSurveyResponses(surveyId: string): Promise<SurveyResponse[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('survey_response').select('*').eq('survey_id', surveyId).order('created_at', { ascending: false });
  if (error) { console.error('Error fetching survey responses:', error); return []; }
  return (data || []).map(normalizeSurveyResponse);
}

export async function getStakeholderSurveyResponse(surveyId: string, stakeholderId: string): Promise<SurveyResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('survey_response').select('*').eq('survey_id', surveyId).eq('stakeholder_id', stakeholderId).maybeSingle();
  if (error) { console.error('Error fetching stakeholder survey response:', error); return null; }
  return data ? normalizeSurveyResponse(data) : null;
}

export async function getSurveyResponseCountMap(surveyIds: string[]): Promise<Record<string, number>> {
  if (surveyIds.length === 0) return {};
  const supabase = await createClient();
  const { data, error } = await supabase.from('survey_response').select('survey_id').in('survey_id', surveyIds);
  if (error) { console.error('Error fetching survey response counts:', error); return {}; }
  return (data || []).reduce((acc: Record<string, number>, row) => {
    if (!row.survey_id) return acc;
    acc[row.survey_id] = (acc[row.survey_id] || 0) + 1;
    return acc;
  }, {});
}

export async function getStakeholderRespondedSurveyIds(stakeholderId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('survey_response').select('survey_id').eq('stakeholder_id', stakeholderId);
  if (error) { console.error('Error fetching responded surveys:', error); return []; }
  return (data || []).map((r) => r.survey_id).filter((id): id is string => Boolean(id));
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
      survey_id: r.survey_id ?? "",
      stakeholder_id: r.stakeholder_id ?? "",
      stakeholder_name: resolvedName,
      answers,
      created_at: r.created_at ?? new Date().toISOString(),
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
      survey_id: r.survey_id ?? "",
      stakeholder_id: r.stakeholder_id ?? "",
      stakeholder_name: resolvedName,
      answers,
      created_at: r.created_at ?? new Date().toISOString(),
      questions,
    };
  });
}
