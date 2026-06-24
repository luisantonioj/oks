'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUserProfile } from '@/lib/queries/user';
import {
  EmergencyContactInput,
  updateEmergencyContactsForProfile,
} from '@/lib/services/emergency-contact-service';

export async function updateEmergencyContacts(officeId: string, contacts: EmergencyContactInput[]) {
  const profile = await getCurrentUserProfile();
  if (!profile) {
    return { error: 'Unauthorized' };
  }

  const result = await updateEmergencyContactsForProfile(profile, officeId, contacts);
  if (result.error) return { error: result.error };

  revalidatePath('/office', 'layout'); 
  revalidatePath('/stakeholder', 'layout'); 
  
  return { success: true };
}
