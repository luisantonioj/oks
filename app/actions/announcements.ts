'use server';

import { createClient } from '../../lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logAction } from '@/lib/queries/audit';
import { getCurrentUserProfile } from '@/lib/queries/user';

export async function createAnnouncement(formData: FormData) {
  try {
    const supabase = await createClient();
    
    // 1. Verify user is authenticated and is office/admin
    const profile = await getCurrentUserProfile();
    if (!profile || (profile.role !== 'office' && profile.role !== 'admin')) {
      return { error: 'Unauthorized' };
    }

    // 2. Extract data
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const priority = formData.get('priority') as string;
    const crisis_id = formData.get('crisis_id') as string;

    if (!title || !content || !crisis_id) {
      return { error: 'Title, content, and Crisis ID are required' };
    }

    // 3. Insert into database
    const { error } = await supabase
      .from('announcement')
      .insert({
        title,
        content,
        priority: priority || 'normal',
        crisis_id,
        office_id: profile.id // The office creating the announcement
      });

    if (error) {
      console.error('Failed to create announcement:', error);
      return { error: error.message || 'Failed to create announcement' };
    }

    void logAction({ actor_id: profile.id, actor_role: profile.role, action: 'CREATE_ANNOUNCEMENT', entity_type: 'announcement', metadata: { title, crisis_id } });

    revalidatePath('/office/dashboard');
    revalidatePath('/portal/dashboard');
    revalidatePath('/stakeholder/dashboard');
    revalidatePath(`/office/crises/${crisis_id}`);
    revalidatePath('/office/crises');
    
    return { success: true, message: 'Announcement posted successfully' };
  } catch (error) {
    console.error('Unexpected error in createAnnouncement:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile || (profile.role !== 'office' && profile.role !== 'admin')) {
      return { error: 'Unauthorized' };
    }

    const supabase = await createClient();

    // Verify ownership if role is office
    if (profile.role === 'office') {
      const { data: announcement, error: announcementError } = await supabase
        .from('announcement')
        .select('office_id')
        .eq('id', id)
        .single();

      if (announcementError || !announcement) {
        return { error: 'Announcement not found' };
      }

      if (announcement.office_id !== profile.id) {
        return { error: 'Unauthorized: You do not own this announcement' };
      }
    }
    
    const { error } = await supabase
      .from('announcement')
      .delete()
      .eq('id', id);

    if (error) return { error: error.message };

    void logAction({ actor_id: profile.id, actor_role: profile.role, action: 'DELETE_ANNOUNCEMENT', entity_type: 'announcement', entity_id: id });

    revalidatePath('/office/dashboard');
    revalidatePath('/portal/dashboard');
    revalidatePath('/office/crises', 'layout');

    return { success: true };
  } catch {
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateAnnouncement(formData: FormData) {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile || (profile.role !== 'office' && profile.role !== 'admin')) {
      return { error: 'Unauthorized' };
    }

    const supabase = await createClient();

    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const priority = formData.get('priority') as string;
    const crisis_id = formData.get('crisis_id') as string;

    if (!id || !title || !content || !crisis_id) {
      return { error: 'Missing required fields' };
    }

    let query = supabase
      .from('announcement')
      .update({
        title,
        content,
        priority: priority || 'normal',
        crisis_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (profile.role === 'office') {
      query = query.eq('office_id', profile.id);
    }

    const { error } = await query;

    if (error) {
      console.error('Failed to update announcement:', error);
      return { error: error.message || 'Failed to update announcement' };
    }

    // Refresh pages
    revalidatePath('/office/announcements');
    revalidatePath('/office/dashboard');
    revalidatePath('/portal/dashboard');
    revalidatePath('/stakeholder/dashboard');
    revalidatePath(`/office/crises/${crisis_id}`);
    revalidatePath('/office/crises');
    
    return { success: true, message: 'Announcement updated successfully' };
  } catch (error) {
    console.error('Unexpected error in updateAnnouncement:', error);
    return { error: 'An unexpected error occurred' };
  }
}
