// app/(auth)/callback/route.ts
import { createServerClient } from '@supabase/ssr';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentUserProfile } from '@/lib/queries/user';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

function mockDLSLValidation(email: string): boolean {
  return email.endsWith('@dlsl.edu.ph') || email.includes('dlsl');
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '';

  const cookieStore = await cookies();
  
  // Track cookies set during authentication to set them on final redirect response
  const responseCookies: { name: string; value: string; options: any }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Write to current request/server context for immediate reading
            try {
              cookieStore.set(name, value, options);
            } catch {
              // Ignore
            }
            // Save for the final NextResponse redirect
            responseCookies.push({ name, value, options });
          });
        },
      },
    }
  );

  // Helper function to build NextResponse.redirect with auth cookies appended
  const redirectWithCookies = (dest: string | URL) => {
    const redirectUrl = new URL(dest, request.url);
    const res = NextResponse.redirect(redirectUrl);
    responseCookies.forEach(({ name, value, options }) => {
      res.cookies.set(name, value, options);
    });
    return res;
  };

  // Determine the target role from query parameter OR cookie
  const role = requestUrl.searchParams.get('role') || cookieStore.get('oks_oauth_role')?.value || 'stakeholder';

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('Code exchange failed:', error);
      const redirectUrl = new URL(role === 'office' ? '/login-office' : '/login', request.url);
      redirectUrl.searchParams.set('error', 'auth_failed');
      redirectUrl.searchParams.set('message', error.message);
      return redirectWithCookies(redirectUrl);
    }
  } else if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    if (error) {
      console.error('OTP verification failed:', error);
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('error', 'confirmation_failed');
      redirectUrl.searchParams.set('message', error.message || 'Link expired or invalid');
      return redirectWithCookies(redirectUrl);
    }
  } else {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('error', 'invalid_link');
    return redirectWithCookies(redirectUrl);
  }

  // Retrieve user details
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('No authenticated user found after session exchange');
    const redirectUrl = new URL(role === 'office' ? '/login-office' : '/login', request.url);
    redirectUrl.searchParams.set('error', 'auth_failed');
    redirectUrl.searchParams.set('message', 'User authentication failed');
    return redirectWithCookies(redirectUrl);
  }

  // Check if profile exists
  const profile = await getCurrentUserProfile();

  if (profile) {
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
    return redirectWithCookies(next || redirectPath);
  }

  // New Google OAuth user or user without a database profile
  if (role === 'office') {
    console.error(`Office profile not found for user: ${user.email}`);
    await supabase.auth.signOut();
    const redirectUrl = new URL('/login-office', request.url);
    redirectUrl.searchParams.set('error', 'office_profile_not_found');
    return redirectWithCookies(redirectUrl);
  }

  // Stakeholder auto-provisioning
  const email = user.email;
  if (!email || !mockDLSLValidation(email)) {
    console.error(`Invalid email domain for stakeholder signup: ${email}`);
    await supabase.auth.signOut();
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('error', 'dlsl_email_required');
    return redirectWithCookies(redirectUrl);
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
      return redirectWithCookies(redirectUrl);
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
      return redirectWithCookies(redirectUrl);
    }

    console.log(`Stakeholder profile auto-created for: ${email}`);
    return redirectWithCookies(next || '/stakeholder/dashboard');
  } catch (error: any) {
    console.error('Unexpected profile provisioning error:', error);
    await supabase.auth.signOut();
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('error', 'profile_creation_failed');
    redirectUrl.searchParams.set('message', error.message || 'Server error');
    return redirectWithCookies(redirectUrl);
  }
}