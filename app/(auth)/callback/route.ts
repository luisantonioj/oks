// app/(auth)/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentUserProfile } from '@/lib/queries/user';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

function mockDLSLValidation(email: string): boolean {
  return email.endsWith('@dlsl.edu.ph') || email.includes('dlsl');
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const code = requestUrl.searchParams.get('code');
  const role = requestUrl.searchParams.get('role') || 'stakeholder';
  const next = requestUrl.searchParams.get('next') ?? '';

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('Code exchange failed:', error);
      const redirectUrl = new URL(role === 'office' ? '/login-office' : '/login', request.url);
      redirectUrl.searchParams.set('error', 'auth_failed');
      redirectUrl.searchParams.set('message', error.message);
      return NextResponse.redirect(redirectUrl);
    }
  } else if (token_hash && type) {
    // Verify and confirm the OTP / magic link
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    if (error) {
      console.error('OTP verification failed:', error);
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('error', 'confirmation_failed');
      redirectUrl.searchParams.set('message', error.message || 'Link expired or invalid');
      return NextResponse.redirect(redirectUrl);
    }
  } else {
    // Neither code nor token_hash is present
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('error', 'invalid_link');
    return NextResponse.redirect(redirectUrl);
  }

  // Retrieve user details post-authentication
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('No authenticated user found after session exchange');
    const redirectUrl = new URL(role === 'office' ? '/login-office' : '/login', request.url);
    redirectUrl.searchParams.set('error', 'auth_failed');
    redirectUrl.searchParams.set('message', 'User authentication failed');
    return NextResponse.redirect(redirectUrl);
  }

  // Check if they already have a profile in the database
  const profile = await getCurrentUserProfile();

  if (profile) {
    // Existing user found, redirect based on their stored role
    let redirectPath = '/stakeholder/dashboard';
    switch (profile.role) {
      case 'admin':
        redirectPath = '/portal/dashboard';
        break;
      case 'office':
        redirectPath = '/office/dashboard';
        break;
      case 'stakeholder':
        redirectPath = '/stakeholder/dashboard';
        break;
    }
    return NextResponse.redirect(new URL(next || redirectPath, request.url));
  }

  // New Google OAuth user or user without a database profile
  if (role === 'office') {
    // Office accounts must be pre-created by the admin. If they try to log in via Google
    // and they don't have an office profile, reject them.
    console.error(`Office profile not found for user: ${user.email}`);
    await supabase.auth.signOut();
    const redirectUrl = new URL('/login-office', request.url);
    redirectUrl.searchParams.set('error', 'office_profile_not_found');
    return NextResponse.redirect(redirectUrl);
  }

  // Stakeholder auto-provisioning
  const email = user.email;
  if (!email || !mockDLSLValidation(email)) {
    console.error(`Invalid email domain for stakeholder signup: ${email}`);
    await supabase.auth.signOut();
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('error', 'dlsl_email_required');
    return NextResponse.redirect(redirectUrl);
  }

  const name = user.user_metadata?.full_name || user.user_metadata?.name || 'Google User';

  try {
    const adminClient = createAdminClient();

    // Set role in app_metadata
    const { error: metadataError } = await adminClient.auth.admin.updateUserById(
      user.id,
      { app_metadata: { role: 'stakeholder' } }
    );

    if (metadataError) {
      console.error('Failed to set stakeholder role in metadata:', metadataError);
      await supabase.auth.signOut();
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('error', 'profile_creation_failed');
      redirectUrl.searchParams.set('message', 'Failed to configure role');
      return NextResponse.redirect(redirectUrl);
    }

    // Insert new stakeholder profile
    const { error: insertError } = await adminClient
      .from('stakeholder')
      .insert({
        id: user.id,
        name,
        email,
        role: 'stakeholder',
      });

    if (insertError) {
      console.error('Profile creation failed:', insertError);
      await supabase.auth.signOut();
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('error', 'profile_creation_failed');
      redirectUrl.searchParams.set('message', insertError.message);
      return NextResponse.redirect(redirectUrl);
    }

    console.log(`Stakeholder profile auto-created for: ${email}`);
    return NextResponse.redirect(new URL(next || '/stakeholder/dashboard', request.url));
  } catch (error: any) {
    console.error('Unexpected profile provisioning error:', error);
    await supabase.auth.signOut();
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('error', 'profile_creation_failed');
    redirectUrl.searchParams.set('message', error.message || 'Server error');
    return NextResponse.redirect(redirectUrl);
  }
}