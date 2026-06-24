// app/actions/profile.ts
'use server';

import { requireRole } from '@/lib/auth/guards';
import {
  updateOfficeProfileForProfile,
  updateStakeholderProfileForProfile,
} from '@/lib/services/profile-service';
import { revalidatePath } from 'next/cache';
import { routes } from '@/lib/routes';

export async function updateOfficeProfile(formData: {
  name: string;
  age: number | null;
  gender: string;
  contact: string;
}) {
  try {
    const auth = await requireRole('office');
    if (!auth.ok) return { error: auth.error };

    const result = await updateOfficeProfileForProfile(auth.profile, formData);
    if (result.error) return { error: result.error };

    revalidatePath(routes.office.profile);
    return { success: true };
  } catch (error) {
    console.error('Unexpected error in updateOfficeProfile:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateStakeholderProfile(formData: {
  name: string;
  age: number | null;
  contact: string;
  permanent_address: string;
  current_address: string;
}) {
  try {
    const auth = await requireRole('stakeholder');
    if (!auth.ok) return { error: auth.error };

    const result = await updateStakeholderProfileForProfile(auth.profile, formData);
    if (result.error) return { error: result.error };

    revalidatePath(routes.stakeholder.profile);
    return { success: true };
  } catch (error) {
    console.error('Unexpected error in updateStakeholderProfile:', error);
    return { error: 'An unexpected error occurred' };
  }
}
