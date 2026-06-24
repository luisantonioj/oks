import { createClient } from '@/lib/supabase/server';
import { Announcement } from '@/types/database';

function normalizeAnnouncement(row: {
  content: string;
  created_at: string | null;
  crisis_id: string | null;
  id: string;
  office_id: string | null;
  priority: string | null;
  title: string;
  updated_at: string | null;
}): Announcement {
  const createdAt = row.created_at ?? new Date().toISOString();

  return {
    ...row,
    created_at: createdAt,
    crisis_id: row.crisis_id ?? "",
    office_id: row.office_id ?? "",
    priority: row.priority ?? "normal",
    updated_at: row.updated_at ?? createdAt,
  };
}

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

  return (data || []).map(normalizeAnnouncement);
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

  return normalizeAnnouncement(data);
}
