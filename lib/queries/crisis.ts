// lib/queries/crisis.ts
import { createClient } from '@/lib/supabase/server';
import { Crisis } from '@/types/database';

export interface DashboardStats {
  totalCrises: number;
  activeCrises: number;
  totalHelpRequests: number;
  pendingHelpRequests: number;
  totalDonations: number;
  totalVolunteers: number;
}

/**
 * Get all crises with optional filtering
 */
export async function getCrises(filters?: {
  status?: 'active' | 'resolved';
  severity?: 'low' | 'high';
}): Promise<Crisis[]> {
  const supabase = await createClient();

  let query = supabase
    .from('crisis')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.severity) {
    query = query.eq('severity', filters.severity);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching crises:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get a single crisis by ID
 */
export async function getCrisisById(id: string): Promise<Crisis | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('crisis')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching crisis:', error);
    return null;
  }

  return data;
}

/**
 * Get active crises
 */
export async function getActiveCrises(): Promise<Crisis[]> {
  return getCrises({ status: 'active' });
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  // Get crisis counts
  const { count: totalCrises } = await supabase
    .from('crisis')
    .select('*', { count: 'exact', head: true });

  const { count: activeCrises } = await supabase
    .from('crisis')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // Get help request counts
  const { count: totalHelpRequests } = await supabase
    .from('help_request')
    .select('*', { count: 'exact', head: true });

  const { count: pendingHelpRequests } = await supabase
    .from('help_request')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  // Get donation count
  const { count: totalDonations } = await supabase
    .from('donation')
    .select('*', { count: 'exact', head: true });

  // Get volunteer count
  const { count: totalVolunteers } = await supabase
    .from('volunteer')
    .select('*', { count: 'exact', head: true });

  return {
    totalCrises: totalCrises || 0,
    activeCrises: activeCrises || 0,
    totalHelpRequests: totalHelpRequests || 0,
    pendingHelpRequests: pendingHelpRequests || 0,
    totalDonations: totalDonations || 0,
    totalVolunteers: totalVolunteers || 0,
  };
}

/**
 * Get crisis summary for dashboard cards
 */
export async function getCrisisSummary() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('crisis')
    .select('id, type, summary, severity, status, affected_areas, created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching crisis summary:', error);
    return [];
  }

  return data || [];
}