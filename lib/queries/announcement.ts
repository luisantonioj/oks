// lib/queries/announcement.ts
import { createClient } from '@/lib/supabase/server';
import { Announcement } from '@/types/database';

/**
 * Get all announcements with optional filtering
 */
export async function getAnnouncements(filters?: {
  priority?: 'low' | 'medium' | 'high';
  crisis_id?: string;
}): Promise<Announcement[]> {
  const supabase = await createClient();

  let query = supabase
    .from('announcement')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.priority) {
    query = query.eq('priority', filters.priority);
  }

  if (filters?.crisis_id) {
    query = query.eq('crisis_id', filters.crisis_id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get a single announcement by ID
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

/**
 * Get announcements for a specific crisis
 */
export async function getAnnouncementsByCrisis(crisisId: string): Promise<Announcement[]> {
  return getAnnouncements({ crisis_id: crisisId });
}

/**
 * Get recent announcements for dashboard
 */
export async function getRecentAnnouncements(limit: number = 5): Promise<Announcement[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('announcement')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent announcements:', error);
    return [];
  }

  return data || [];
}