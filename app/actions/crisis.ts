// app/actions/crisis.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type CrisisActionState = {
  error?: string;
  success?: boolean;
};

// app/actions/crisis.ts

export async function createCrisis(
  prevState: CrisisActionState, 
  formData: FormData
): Promise<CrisisActionState> {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Unauthorized' };

    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const severity = formData.get('severity') as string;
    const summary = formData.get('summary') as string;
    const required_actions = formData.get('required_actions') as string;

    const areasInput = formData.get('affected_areas') as string;
    const affected_areas = areasInput 
      ? areasInput.split(',').map(area => area.trim()).filter(Boolean) 
      : [];

    const features = {
      survey:               formData.get("feature_survey")      === "on",
      help_button:          formData.get("feature_help_button") === "on",
      progress:             formData.get("feature_progress")    === "on",
      donation:             formData.get("feature_donation")    === "on",
      volunteer:            formData.get("feature_volunteer")   === "on",
      notify_stakeholders:  formData.get("feature_notify")      === "on",
      sound_alarm:          formData.get("feature_alarm")       === "on",
      request_backup:       formData.get("feature_backup")      === "on",
      lockdown_areas:       formData.get("feature_lockdown")    === "on",
    };

    if (!name || !type || !severity) {
      return { error: 'Name, Type, and Severity are required.' };
    }

    const { data, error } = await supabase
      .from('crisis')
      .insert({
        name,
        type,
        summary,
        affected_areas,
        severity,
        required_actions,
        features,
        status: 'active',
        office_id: user.id
      })
      .select() 
      .single();

    if (error) {
      console.error('Failed to create crisis:', error);
      return { error: error.message || 'Failed to create crisis' };
    }

    revalidatePath('/office/crises');
    revalidatePath('/office/dashboard');
    revalidatePath('/portal/dashboard');
    revalidatePath('/stakeholder/dashboard');
    
    redirect(`/office/crises/${data.id}`);

  } catch (error) {
    console.error('Unexpected error in createCrisis:', error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error; 
    }
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateCrisis(
  prevState: CrisisActionState, 
  formData: FormData
): Promise<CrisisActionState> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const id = formData.get('id') as string;
    if (!id) return { error: 'Crisis ID is missing' };

    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const severity = formData.get('severity') as string;
    const summary = formData.get('summary') as string;
    const required_actions = formData.get('required_actions') as string;

    const areasInput = formData.get('affected_areas') as string;
    const affected_areas = areasInput 
      ? areasInput.split(',').map(area => area.trim()).filter(Boolean) 
      : [];

    const features = {
      survey:               formData.get("feature_survey")      === "on",
      help_button:          formData.get("feature_help_button") === "on",
      progress:             formData.get("feature_progress")    === "on",
      donation:             formData.get("feature_donation")    === "on",
      volunteer:            formData.get("feature_volunteer")   === "on",
      notify_stakeholders:  formData.get("feature_notify")      === "on",
      sound_alarm:          formData.get("feature_alarm")       === "on",
      request_backup:       formData.get("feature_backup")      === "on",
      lockdown_areas:       formData.get("feature_lockdown")    === "on",
    };

    if (!name || !type || !severity) return { error: 'Name, Type, and Severity are required.' };

    const { error } = await supabase
      .from('crisis')
      .update({
        name,
        type,
        summary,
        affected_areas,
        severity,
        required_actions,
        features,
        updated_at: new Date().toISOString()
      })
      .eq('id', id); // Ensure it only updates this specific crisis!

    if (error) return { error: error.message };

    // Refresh pages to show updated data
    revalidatePath('/office/crises');
    revalidatePath(`/office/crises/${id}`);
    revalidatePath('/office/dashboard');
    
    return { success: true };
  } catch (error) {
    return { error: 'An unexpected error occurred during update' };
  }
}

// Update Crisis Status (Kept unchanged)
export async function updateCrisisStatus(id: string, status: string, resolution_notes?: string) {
  try {
    const supabase = await createClient();
    
    const updateData: any = { status, updated_at: new Date().toISOString() };
    if (resolution_notes) {
      updateData.resolution_notes = resolution_notes;
    }

    const { error } = await supabase
      .from('crisis')
      .update(updateData)
      .eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/office/crises');
    revalidatePath(`/office/crises/${id}`);
    revalidatePath('/office/dashboard');
    return { success: true };
  } catch (error) {
    return { error: 'An unexpected error occurred' };
  }
}

export async function deleteCrisis(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Unauthorized' };

    // ADDED .select() to verify the row was actually deleted
    const { data, error } = await supabase
      .from('crisis')
      .delete()
      .eq('id', id)
      .select();

    if (error) return { error: error.message };

    // NEW: If data is empty, RLS blocked it or the ID didn't match.
    if (!data || data.length === 0) {
      return { 
        error: 'Delete blocked by Database. Please check your Supabase RLS Policies for the crisis table.' 
      };
    }

    // Refresh pages to reflect the deletion
    revalidatePath('/office/crises');
    revalidatePath('/office/dashboard');
    
    return { success: true };
  } catch (error) {
    return { error: 'An unexpected error occurred while deleting' };
  }
}