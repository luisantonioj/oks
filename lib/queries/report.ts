// lib/queries/report.ts
import { createClient } from '../supabase/server';

export interface ProgressReportWithDetails {
  id: string;
  crisis_id: string;
  title: string | null;
  content: string;
  icon: string | null;
  created_at: string;
  crisis?: { name?: string | null } | null;
  office?: { name?: string | null } | null;
}

export async function getProgressReports(): Promise<ProgressReportWithDetails[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('progress_report')
    .select(`
      *,
      crisis:crisis_id(name),
      office:office_id(name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching progress reports:', error);
    return [];
  }
  
  return (data || []) as ProgressReportWithDetails[];
}
