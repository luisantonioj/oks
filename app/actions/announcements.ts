'use server';

import { createClient } from '../../lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logAction } from '@/lib/queries/audit';
import { requireAnyRole } from '@/lib/auth/guards';
import { assertCanManageAnnouncement } from '@/lib/auth/policies';

export async function createAnnouncement(formData: FormData) {
  try {
    const supabase = await createClient();
    
    const auth = await requireAnyRole(['office', 'admin']);
    if (!auth.ok) return { error: auth.error };
    const { profile } = auth;

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
    const auth = await requireAnyRole(['office', 'admin']);
    if (!auth.ok) return { error: auth.error };
    const { profile } = auth;

    const supabase = await createClient();

    const policy = await assertCanManageAnnouncement(profile, id);
    if (!policy.ok) return { error: policy.error };
    
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
    const auth = await requireAnyRole(['office', 'admin']);
    if (!auth.ok) return { error: auth.error };
    const { profile } = auth;

    const supabase = await createClient();

    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const priority = formData.get('priority') as string;
    const crisis_id = formData.get('crisis_id') as string;

    if (!id || !title || !content || !crisis_id) {
      return { error: 'Missing required fields' };
    }

    const policy = await assertCanManageAnnouncement(profile, id);
    if (!policy.ok) return { error: policy.error };

    const { error } = await supabase
      .from('announcement')
      .update({
        title,
        content,
        priority: priority || 'normal',
        crisis_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

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
