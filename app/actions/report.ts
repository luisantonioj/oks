// app/actions/report.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getCurrentUserProfile } from '@/lib/queries/user';

export async function createProgressReport(data: {
  crisis_id: string;
  title: string;
  content: string;
  icon: string;
}) {
  const profile = await getCurrentUserProfile();
  if (!profile || (profile.role !== 'office' && profile.role !== 'admin')) {
    throw new Error('Unauthorized');
  }

  const supabase = await createClient();
  
  const { error } = await supabase
    .from('progress_report')
    .insert({
      crisis_id: data.crisis_id,
      title: data.title,
      content: data.content,
      icon: data.icon,
      office_id: profile.id
    });

  if (error) throw new Error(error.message);

  // Automatically refresh the reports page to show the new data
  revalidatePath('/office/reports');
}

export async function updateProgressReport(
  reportId: string,
  data: {
    crisis_id: string;
    title: string;
    content: string;
    icon: string;
  }
) {
  const profile = await getCurrentUserProfile();
  if (!profile || (profile.role !== 'office' && profile.role !== 'admin')) {
    throw new Error('Unauthorized');
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('progress_report')
    .update({
      crisis_id: data.crisis_id,
      title: data.title,
      content: data.content,
      icon: data.icon,
    })
    .eq('id', reportId)
    .eq('office_id', profile.id); // Extra security: ensure they own it

  if (error) throw new Error(error.message);

  revalidatePath('/office/reports');
}