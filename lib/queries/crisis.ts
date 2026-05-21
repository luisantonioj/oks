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
    // Removed volunteer and donation joins to prevent PGRST200 schema error
    .select(`
      *,
      help_requests:help_request(id)
    `)
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

  // Map data and default volunteers/donations to 0 to satisfy TypeScript UI
  return (data || []).map((row: any) => ({
    ...row,
    help_requests: row.help_requests || [],
    volunteers: 0, 
    donations_count: 0
  })) as unknown as Crisis[];
}

/**
 * Get a single crisis by ID
 */
export async function getCrisisById(id: string): Promise<Crisis | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('crisis')
    // Removed volunteer and donation joins
    .select(`
      *,
      announcements:announcement(*),
      help_requests:help_request(id, location, status, created_at, stakeholder:stakeholder_id(name)),
      progress_updates:progress_report(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching crisis:', error);
    return null;
  }

  // Map data and default volunteers/donations to 0
  return {
    ...data,
    help_requests: (data.help_requests || []).map((req: any) => ({
      id: req.id,
      name: req.stakeholder?.name || 'Unknown',
      location: req.location,
      status: req.status,
      time: new Date(req.created_at).toLocaleString('en-PH', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
      }),
    })),
    volunteers: 0,
    donations_count: 0
  } as unknown as Crisis;
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

  // Get volunteer/donation counts from survey responses (survey-driven approach)
  const { data: typedSurveys } = await supabase
    .from('survey')
    .select('id, survey_type')
    .in('survey_type', ['volunteer', 'donation']);

  const volIds = (typedSurveys || []).filter((s) => s.survey_type === 'volunteer').map((s) => s.id);
  const donIds = (typedSurveys || []).filter((s) => s.survey_type === 'donation').map((s) => s.id);

  const [volResult, donResult] = await Promise.all([
    volIds.length > 0
      ? supabase.from('survey_response').select('*', { count: 'exact', head: true }).in('survey_id', volIds)
      : Promise.resolve({ count: 0 }),
    donIds.length > 0
      ? supabase.from('survey_response').select('*', { count: 'exact', head: true }).in('survey_id', donIds)
      : Promise.resolve({ count: 0 }),
  ]);

  return {
    totalCrises: totalCrises || 0,
    activeCrises: activeCrises || 0,
    totalHelpRequests: totalHelpRequests || 0,
    pendingHelpRequests: pendingHelpRequests || 0,
    totalDonations: donResult.count || 0,
    totalVolunteers: volResult.count || 0,
  };
}

/**
 * Get crisis summary for dashboard cards
 */
export async function getCrisisSummary() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('crisis')
    // Removed volunteer and donation joins
    .select(`
      id, name, type, summary, severity, status, affected_areas, created_at,
      help_requests:help_request(id)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching crisis summary:', error);
    return [];
  }

  // Map data and default volunteers/donations to 0
  return (data || []).map((row: any) => ({
    ...row,
    help_requests: row.help_requests || [],
    volunteers: 0,
    donations_count: 0
  }));
}