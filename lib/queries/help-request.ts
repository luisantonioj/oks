//lib/queries/help-request.ts
import { createClient } from '@/lib/supabase/server';
import { HelpRequest } from '@/types/database';

/**
 * Fetch help requests submitted by a specific stakeholder
 */
export async function getStakeholderHelpRequests(stakeholderId: string): Promise<HelpRequest[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('help_request')
    .select('*')
    .eq('stakeholder_id', stakeholderId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching stakeholder help requests:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch all help requests for the Office/Admin dashboards
 * Allows optional filtering by status or specific crisis
 */
export async function getAllHelpRequests(filters?: {
  status?: string;
  crisis_id?: string;
}): Promise<HelpRequest[]> {
  const supabase = await createClient();
  
  let query = supabase
    .from('help_request')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.crisis_id) {
    query = query.eq('crisis_id', filters.crisis_id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching all help requests:', error);
    return [];
  }

  return data || [];
}