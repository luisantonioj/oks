//lib/queries/survey.ts
import { createClient } from '@/lib/supabase/server';
import { Survey, SurveyResponse } from '@/types/database';

export async function getSurveys(filters?: {
  crisis_id?: string;
  status?: string;
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