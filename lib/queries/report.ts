// lib/queries/report.ts
import { createClient } from '../supabase/server';

export async function getProgressReports() {
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
  
  return data;
}
