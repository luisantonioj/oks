'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateEmergencyContacts(officeId: string, contacts: any[]) {
  if (!officeId) return { error: "Office ID is missing" };
  
  const supabase = await createClient();
  
  // 1. Delete all existing contacts for this office
  const { error: deleteError } = await supabase
    .from('emergency_contact')
    .delete()
    .eq('office_id', officeId);

  if (deleteError) {
    console.error("Error clearing old contacts:", deleteError);
    return { error: deleteError.message };
  }

  // 2. Insert the fresh list of contacts
  if (contacts && contacts.length > 0) {
    const newContacts = contacts.map(contact => ({
      office_id: officeId,
      label: contact.label,
      number: contact.number,
      note: contact.note,
      icon: contact.icon
    }));

    const { error: insertError } = await supabase
      .from('emergency_contact')
      .insert(newContacts);

    if (insertError) {
      console.error("Error inserting new contacts:", insertError);
      return { error: insertError.message };
    }
  }

  // 3. Update the office's timestamp just to show recent activity
  await supabase
    .from('office')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', officeId);

  // Refresh layouts so stakeholders and offices see the change instantly
  revalidatePath('/office', 'layout'); 
  revalidatePath('/stakeholder', 'layout'); 
  
  return { success: true };
}