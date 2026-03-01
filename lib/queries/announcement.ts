import { createClient } from '@/lib/supabase/server';
import { Announcement } from '@/types/database';

/**
 * Fetch all announcements, optionally filtered by a specific crisis
 */
export async function getAnnouncements(crisisId?: string): Promise<Announcement[]> {
  const supabase = await createClient();
  
  let query = supabase
    .from('announcement')
    .select('*')
    .order('created_at', { ascending: false });

  if (crisisId) {
    query = query.eq('crisis_id', crisisId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch a single announcement by its ID
 */
export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('announcement')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching announcement:', error);
    return null;
  }

  return data;
}