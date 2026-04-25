// app/actions/report.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createProgressReport(data: {
  crisis_id: string;
  title: string;
  content: string;
  icon: string;
}) {
  const supabase = await createClient();
  
  // Get the current user to attach their office_id
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('progress_report')
    .insert({
      crisis_id: data.crisis_id,
      title: data.title,
      content: data.content,
      icon: data.icon,
      office_id: userData.user.id
    });

  if (error) throw new Error(error.message);

  // Automatically refresh the reports page to show the new data
  revalidatePath('/office/reports');
}