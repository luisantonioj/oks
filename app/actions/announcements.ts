'use server';

import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import { requireAnyRole } from '@/lib/auth/guards';
import {
  createAnnouncementForProfile,
  deleteAnnouncementForProfile,
  updateAnnouncementForProfile,
} from '@/lib/services/announcement-service';
import {
  announcementInputFromFormData,
  announcementUpdateInputFromFormData,
} from '@/lib/validation/announcement';

type AnnouncementActionResult =
  | { error: string; success?: never; message?: never }
  | { error?: never; success: true; message: string };

type DeleteAnnouncementActionResult =
  | { error: string; success?: never }
  | { error?: never; success: true };

function validationErrorMessage(error: ZodError) {
  return error.issues[0]?.message ?? 'Invalid announcement details';
}

export async function createAnnouncement(formData: FormData): Promise<AnnouncementActionResult> {
  try {
    const auth = await requireAnyRole(['office', 'admin']);
    if (!auth.ok) return { error: auth.error };
    const { profile } = auth;

    const input = announcementInputFromFormData(formData);
    const result = await createAnnouncementForProfile(profile, input);
    if (result.error) return result;

    revalidatePath('/office/dashboard');
    revalidatePath('/portal/dashboard');
    revalidatePath('/stakeholder/dashboard');
    revalidatePath(`/office/crises/${input.crisis_id}`);
    revalidatePath('/office/crises');
    
    return { success: true, message: 'Announcement posted successfully' };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: validationErrorMessage(error) };
    }

    console.error('Unexpected error in createAnnouncement:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function deleteAnnouncement(id: string): Promise<DeleteAnnouncementActionResult> {
  try {
    const auth = await requireAnyRole(['office', 'admin']);
    if (!auth.ok) return { error: auth.error };
    const { profile } = auth;

    const result = await deleteAnnouncementForProfile(profile, id);
    if (result.error) return result;

    revalidatePath('/office/dashboard');
    revalidatePath('/portal/dashboard');
    revalidatePath('/office/crises', 'layout');

    return { success: true };
  } catch (error) {
    console.error('Unexpected error in deleteAnnouncement:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateAnnouncement(formData: FormData): Promise<AnnouncementActionResult> {
  try {
    const auth = await requireAnyRole(['office', 'admin']);
    if (!auth.ok) return { error: auth.error };
    const { profile } = auth;

    const input = announcementUpdateInputFromFormData(formData);
    const result = await updateAnnouncementForProfile(profile, input);
    if (result.error) return result;

    revalidatePath('/office/announcements');
    revalidatePath('/office/dashboard');
    revalidatePath('/portal/dashboard');
    revalidatePath('/stakeholder/dashboard');
    revalidatePath(`/office/crises/${input.crisis_id}`);
    revalidatePath('/office/crises');
    
    return { success: true, message: 'Announcement updated successfully' };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: validationErrorMessage(error) };
    }

    console.error('Unexpected error in updateAnnouncement:', error);
    return { error: 'An unexpected error occurred' };
  }
}
