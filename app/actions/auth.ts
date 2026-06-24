// app/actions/auth.ts
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserProfile } from '@/lib/queries/user';
import { cookies } from 'next/headers';
import { ZodError } from 'zod';
import {
  createOfficeInputFromFormData,
  signInInputFromFormData,
  stakeholderSignupInputFromFormData,
} from '@/lib/validation/auth';
import { createOfficeAccountForAdmin, createStakeholderAccount } from '@/lib/services/user-service';

type FormState = {
  error?: string;
  success?: boolean;
  message?: string;
};

function validationErrorMessage(error: ZodError) {
  return error.issues[0]?.message ?? 'Invalid form details';
}

// ── ADMIN LOGIN (Supabase Auth checking role === 'admin') ──
export async function adminSignIn(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const input = signInInputFromFormData(formData);

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error || !data.user) {
      console.error('[adminSignIn] Auth error:', error);
      return { error: 'Invalid login credentials' };
    }

    // Check if the user is designated as admin in app_metadata
    const role = data.user.app_metadata?.role;
    if (role !== 'admin') {
      console.error('[adminSignIn] User is not an admin, actual role:', role);
      await supabase.auth.signOut();
      return { error: 'Unauthorized: Admin access required' };
    }

    // Redirect to admin dashboard
    redirect('/portal/dashboard');
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: validationErrorMessage(error) };
    }

    console.error('[adminSignIn] Error:', error);
    // Re-throw redirect errors (these are expected)
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }
    return { error: 'An unexpected error occurred' };
  }
}


// ── OFFICE LOGIN ──
export async function officeSignIn(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const input = signInInputFromFormData(formData);

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error || !data.user) {
      console.error('[officeSignIn] Auth error:', error);
      return { error: 'Invalid login credentials' };
    }

    // Check if user exists in office table
    const { data: officeProfile, error: profileError } = await supabase
      .from('office')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError) {
      console.error('[officeSignIn] Database error:', profileError);
      await supabase.auth.signOut();
      return { error: 'Error loading office profile. Please contact support.' };
    }

    if (!officeProfile) {
      console.error('[officeSignIn] Office profile not found in database');
      await supabase.auth.signOut();
      return { error: 'Office account not found. Please contact support.' };
    }

    redirect('/office/dashboard');
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: validationErrorMessage(error) };
    }

    console.error('[officeSignIn] Error:', error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }
    return { error: 'An unexpected error occurred' };
  }
}

// ── STAKEHOLDER SIGNUP (existing) ──
export async function signUpStakeholder(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const input = stakeholderSignupInputFromFormData(formData);
    return await createStakeholderAccount(input);
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: validationErrorMessage(error) };
    }

    console.error('Signup error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ── STAKEHOLDER LOGIN (existing) ──
export async function signIn(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const input = signInInputFromFormData(formData);

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error || !data.user) {
      return { error: error?.message || 'Invalid credentials' };
    }

    const profile = await getCurrentUserProfile();

    if (!profile) {
      await supabase.auth.signOut();
      return { error: 'Profile not found. Please contact support.' };
    }

    switch (profile.role) {
      case 'admin':
        redirect('/portal/dashboard');
      case 'office':
        redirect('/office/dashboard');
      case 'stakeholder':
        redirect('/stakeholder/dashboard');
      default:
        await supabase.auth.signOut();
        return { error: 'Unknown role' };
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: validationErrorMessage(error) };
    }

    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    console.error('[signIn] Error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ── SIGN OUT ──
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

// ── ADMIN SIGN OUT ──
export async function adminSignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const cookieStore = await cookies();
  cookieStore.delete('oks_admin_session');
  redirect('/login-portal');
}

// ── CREATE OFFICE (Admin-only) ──
export async function createOffice(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const input = createOfficeInputFromFormData(formData);

    // Verify admin session via Supabase profile
    const profile = await getCurrentUserProfile();

    if (!profile || profile.role !== 'admin') {
      console.error('[createOffice] Unauthorized access attempt');
      return { error: 'Unauthorized: Admin only' };
    }

    return await createOfficeAccountForAdmin(profile, input);
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: validationErrorMessage(error) };
    }

    console.error('[createOffice] Unexpected error:', error);
    return { error: 'An unexpected error occurred while creating the office account' };
  }
}
