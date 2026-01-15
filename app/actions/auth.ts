// app/actions/auth.ts
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentUserProfile } from '@/lib/queries/user';

// Mock DLSL validation (replace with real DB query or API later)
function mockDLSLValidation(email: string): boolean {
  return email.endsWith('@dlsl.edu.ph') || email.includes('dlsl');
}

type FormState = {
  error?: string;
  success?: boolean;
  message?: string;
};

// ── SIGNUP (Stakeholder self-registration) ──
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

  // Mock DLSL check
  if (!mockDLSLValidation(email)) {
    return { error: 'Email must be a valid DLSL address' };
  }

  const supabase = await createClient();
  const adminClient = createAdminClient();

  try {
    // 1. Sign up auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          name, // This goes to user_metadata
        },
      },
    });

    if (signUpError || !authData.user) {
      return { error: signUpError?.message || 'Signup failed' };
    }

    const userId = authData.user.id;

    // 2. Set role in app_metadata (secure, for RLS/JWT)
    const { error: metadataError } = await adminClient.auth.admin.updateUserById(
      userId,
      {
        app_metadata: { role: 'stakeholder' },
      }
    );

    if (metadataError) {
      await adminClient.auth.admin.deleteUser(userId);
      return { error: 'Failed to set user role' };
    }

    // 3. Insert into stakeholder table
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
      console.error('Insert error:', insertError);
      await adminClient.auth.admin.deleteUser(userId);
      return { error: insertError.message || 'Profile creation failed' };
    }

    return { 
      success: true, 
      message: 'Account created successfully! Please check your email to confirm your account.' 
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ── LOGIN ──
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

  // Step 1: Attempt sign in
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    console.error('Sign in error:', error);
    return { error: error?.message || 'Invalid credentials' };
  }

  // Step 2: Fetch profile to determine role
  const profile = await getCurrentUserProfile();

  if (!profile) {
    console.error('No profile found for user:', data.user.id);
    await supabase.auth.signOut();
    return { error: 'Profile not found. Please contact support.' };
  }

  // Step 3: Role-based redirect
  // IMPORTANT: redirect() must be called OUTSIDE of try-catch
  // because it throws a NEXT_REDIRECT error internally
  console.log('Login successful. Redirecting to:', profile.role, 'dashboard');
  
  switch (profile.role) {
    case 'admin':
      redirect('/protected/admin/dashboard');
    case 'office':
      redirect('/protected/office/dashboard');
    case 'stakeholder':
      redirect('/protected/stakeholder/dashboard');
    default:
      await supabase.auth.signOut();
      return { error: 'Unknown role' };
  }
}

// ── SIGN OUT ──
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth/login');
}

// ── CREATE OFFICE (Admin-only) ──
export async function createOffice(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile || profile.role !== 'admin') {
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

    const supabase = await createClient();
    const adminClient = createAdminClient();

    // 1. Create auth user
    const { data: authData, error: signUpError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
      },
      app_metadata: {
        role: 'office',
      },
    });

    if (signUpError || !authData.user) {
      return { error: signUpError?.message || 'User creation failed' };
    }

    const userId = authData.user.id;

    // 2. Insert office profile
    const { error: insertError } = await supabase
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