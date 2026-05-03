// lib/queries/help-request.ts
import { createClient } from '@/lib/supabase/server';
import { HelpRequest } from '@/types/database';

export interface HelpRequestWithDetails extends HelpRequest {
  crisis?: { id: string; name: string; type: string; severity: string } | null;
  office?: { id: string; name: string; office_name: string } | null;
  stakeholder?: {
    id: string;
    name: string;
    age: number | null;
    contact: string | null;
    community: string | null;
    permanent_address: string | null;
    current_address: string | null;
  } | null;
}

/**
 * Fetch help requests submitted by a specific stakeholder
 */
export async function getStakeholderHelpRequests(stakeholderId: string): Promise<HelpRequestWithDetails[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('help_request')
    .select(`
      *,
      crisis:crisis_id(id, name, type, severity),
      office:office_id(id, name, office_name),
      stakeholder:stakeholder_id(id, name, age, contact, community, permanent_address, current_address)
    `)
    .eq('stakeholder_id', stakeholderId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching stakeholder help requests:', error);
    return [];
  }

  return data as HelpRequestWithDetails[];
}

/**
 * Fetch all help requests for the Office/Admin dashboards
 * Allows optional filtering by status or specific crisis
 */
export async function getAllHelpRequests(filters?: {
  status?: string;
  crisis_id?: string;
}): Promise<HelpRequestWithDetails[]> {
  const supabase = await createClient();
  
  let query = supabase
    .from('help_request')
    .select(`
      *,
      crisis:crisis_id(id, name, type, severity),
      office:office_id(id, name, office_name),
      stakeholder:stakeholder_id(id, name, age, contact, community, permanent_address, current_address)
    `)
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

  return data as HelpRequestWithDetails[];
}