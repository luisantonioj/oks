// app/actions/auth.ts
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentUserProfile } from '@/lib/queries/user';
import { cookies } from 'next/headers';

// Mock DLSL validation
function mockDLSLValidation(email: string): boolean {
  return email.endsWith('@dlsl.edu.ph') || email.includes('dlsl');
}

type FormState = {
  error?: string;
  success?: boolean;
  message?: string;
};

// ── ADMIN LOGIN (Hardcoded check with secure cookie - NO SUPABASE) ──
export async function adminSignIn(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('[adminSignIn] Login attempt for:', email);

    if (!email || !password) {
      return { error: 'Email and password required' };
    }

    // Load admin credentials from environment variables
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error('[adminSignIn] ADMIN_EMAIL or ADMIN_PASSWORD not set in environment');
      return { error: 'Server configuration error. Please contact support.' };
    }

    if (email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
      console.log('[adminSignIn] Invalid credentials provided');
      return { error: 'Invalid admin credentials' };
    }

    // Set cookie for admin session (NO Supabase involved)
    const cookieStore = await cookies();
    cookieStore.set('oks_admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    console.log('[adminSignIn] ✓ Admin authenticated, cookie set, redirecting...');

    // Redirect to admin dashboard
    redirect('/admin/dashboard');
  } catch (error) {
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
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password required' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: error?.message || 'Invalid credentials' };
  }

  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== 'office') {
    await supabase.auth.signOut();
    return { error: 'Office account not found' };
  }

  redirect('/office/dashboard');
}

// ── STAKEHOLDER SIGNUP (existing) ──
export async function signUpStakeholder(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const age = formData.get('age') ? Number(formData.get('age')) : null;
  const community = formData.get('community') as string || null;
  const contact = formData.get('contact') as string || null;
  const permanentAddress = formData.get('permanent_address') as string || null;
  const currentAddress = formData.get('current_address') as string || null;

  if (!email || !password || !name) {
    return { error: 'Required fields missing' };
  }

  if (!mockDLSLValidation(email)) {
    return { error: 'Email must be a valid DLSL address' };
  }

  const supabase = await createClient();
  const adminClient = createAdminClient();

  try {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback`,
        data: { name },
      },
    });

    if (signUpError || !authData.user) {
      return { error: signUpError?.message || 'Signup failed' };
    }

    const userId = authData.user.id;

    const { error: metadataError } = await adminClient.auth.admin.updateUserById(
      userId,
      { app_metadata: { role: 'stakeholder' } }
    );

    if (metadataError) {
      await adminClient.auth.admin.deleteUser(userId);
      return { error: 'Failed to set user role' };
    }

    const { error: insertError } = await adminClient
      .from('stakeholder')
      .insert({
        id: userId,
        name,
        email,
        role: 'stakeholder',
        age,
        community,
        contact,
        permanent_address: permanentAddress,
        current_address: currentAddress,
      });

    if (insertError) {
      await adminClient.auth.admin.deleteUser(userId);
      return { error: insertError.message || 'Profile creation failed' };
    }

    return { 
      success: true, 
      message: 'Account created! Please check your email to confirm.' 
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ── STAKEHOLDER LOGIN (existing) ──
export async function signIn(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password required' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
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
      redirect('/admin/dashboard');
    case 'office':
      redirect('/office/dashboard');
    case 'stakeholder':
      redirect('/stakeholder/dashboard');
    default:
      await supabase.auth.signOut();
      return { error: 'Unknown role' };
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
  const cookieStore = await cookies();
  cookieStore.delete('oks_admin_session');
  redirect('/login-admin');
}

// ── CREATE OFFICE (Admin-only) ──
export async function createOffice(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // Verify admin session via cookie
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('oks_admin_session')?.value;

    if (adminSession !== 'authenticated') {
      return { error: 'Unauthorized: Admin only' };
    }

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const officeName = formData.get('office_name') as string;
    const age = formData.get('age') ? Number(formData.get('age')) : null;
    const gender = formData.get('gender') as string || null;
    const contact = formData.get('contact') as string || null;

    if (!email || !password || !officeName || !name) {
      return { error: 'Required fields missing' };
    }

    const adminClient = createAdminClient();

    const { data: authData, error: signUpError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
      app_metadata: { role: 'office' },
    });

    if (signUpError || !authData.user) {
      return { error: signUpError?.message || 'User creation failed' };
    }

    const userId = authData.user.id;

    const { error: insertError } = await adminClient
      .from('office')
      .insert({
        id: userId,
        name,
        email,
        role: 'office',
        office_name: officeName,
        age,
        gender,
        contact,
      });

    if (insertError) {
      await adminClient.auth.admin.deleteUser(userId);
      return { error: insertError.message || 'Office profile creation failed' };
    }

    return { 
      success: true, 
      message: `Office account created for ${officeName}` 
    };
  } catch (error) {
    console.error('Create office error:', error);
    return { error: 'An unexpected error occurred' };
  }
}