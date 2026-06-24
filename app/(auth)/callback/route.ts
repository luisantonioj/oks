// app/(auth)/callback/route.ts
import { createServerClient } from '@supabase/ssr';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import type { CookieOptions } from '@supabase/ssr';
import type { EmailOtpType, User } from '@supabase/supabase-js';
import { UserRole } from '@/types/database';
import { isDlslEmailAllowedForSignup } from '@/lib/validation/email';
import { dashboardRouteForRole, loginRouteForRole } from '@/lib/routes';

function isEmailOtpType(type: string): type is EmailOtpType {
  return ['signup', 'invite', 'magiclink', 'recovery', 'email_change', 'email'].includes(type);
}

function isUserRole(role: string | null | undefined): role is UserRole {
  return role === 'admin' || role === 'office' || role === 'stakeholder';
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Server error';
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '';

  // Determine the target role from query parameter OR cookie
  const role = requestUrl.searchParams.get('role')
    || request.cookies.get('oks_oauth_role')?.value
    || 'stakeholder';

  // ── Build a Supabase client that tracks every cookie it sets ──
  // We'll replay those cookies onto the final redirect response.
  const pendingCookies: { name: string; value: string; options: CookieOptions }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            pendingCookies.push({ name, value, options });
          });
        },
      },
    }
  );

  // Helper: redirect and replay auth cookies
  const redirectWithCookies = (dest: string | URL) => {
    const url = typeof dest === 'string' ? new URL(dest, requestUrl.origin) : dest;
    const res = NextResponse.redirect(url);
    for (const { name, value, options } of pendingCookies) {
      res.cookies.set(name, value, options);
    }
    // Clean up the temporary role cookie
    res.cookies.set('oks_oauth_role', '', { path: '/', maxAge: 0 });
    return res;
  };

  // Helper: redirect to login page with error
  const redirectToLoginWithError = (errorKey: string, message?: string) => {
    const loginPath = role === 'office' ? loginRouteForRole('office') : loginRouteForRole('stakeholder');
    const url = new URL(loginPath, requestUrl.origin);
    url.searchParams.set('error', errorKey);
    if (message) url.searchParams.set('message', message);
    return redirectWithCookies(url);
  };

  // ─── Exchange the code or verify OTP ───
  let sessionUser: User | null = null;

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('Code exchange failed:', error.message);
      return redirectToLoginWithError('auth_failed', error.message);
    }
    sessionUser = data.user;
  } else if (token_hash && type && isEmailOtpType(type)) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });
    if (error) {
      console.error('OTP verification failed:', error.message);
      return redirectToLoginWithError('confirmation_failed', error.message || 'Link expired or invalid');
    }
    sessionUser = data.user;
  } else {
    return redirectToLoginWithError('invalid_link');
  }

  // Use the user from the session data directly (avoids stale cookie reads)
  if (!sessionUser) {
    console.error('No user returned from session exchange');
    return redirectToLoginWithError('auth_failed', 'User authentication failed');
  }

  // ─── Determine existing role ───
  let userRole = isUserRole(sessionUser.app_metadata?.role)
    ? sessionUser.app_metadata.role
    : null;

  if (!userRole) {
    // Check both tables for an existing profile
    const adminClient = createAdminClient();
    const [shRes, officeRes] = await Promise.all([
      adminClient.from('stakeholder').select('role').eq('id', sessionUser.id).maybeSingle(),
      adminClient.from('office').select('role').eq('id', sessionUser.id).maybeSingle(),
    ]);
    if (isUserRole(shRes.data?.role)) {
      userRole = shRes.data.role;
    } else if (isUserRole(officeRes.data?.role)) {
      userRole = officeRes.data.role;
    }
  }

  // ─── Existing user — redirect to dashboard ───
  if (userRole) {
    return redirectWithCookies(next || dashboardRouteForRole(userRole));
  }

  // ─── New Google OAuth user without a database profile ───

  // Office users must be pre-created by admin
  if (role === 'office') {
    console.error(`Office profile not found for user: ${sessionUser.email}`);
    await supabase.auth.signOut();
    return redirectToLoginWithError('office_profile_not_found');
  }

  // Stakeholder auto-provisioning
  const email = sessionUser.email;
  if (!email || !isDlslEmailAllowedForSignup(email)) {
    console.error(`Invalid email domain for stakeholder signup: ${email}`);
    await supabase.auth.signOut();
    return redirectToLoginWithError('dlsl_email_required');
  }

  const name = sessionUser.user_metadata?.full_name
    || sessionUser.user_metadata?.name
    || 'Google User';

  try {
    const adminClient = createAdminClient();

    // Set role in app_metadata
    const { error: metadataError } = await adminClient.auth.admin.updateUserById(
      sessionUser.id,
      { app_metadata: { role: 'stakeholder' } }
    );

    if (metadataError) {
      console.error('Failed to set stakeholder role in metadata:', metadataError);
      await supabase.auth.signOut();
      return redirectToLoginWithError('profile_creation_failed', 'Failed to configure role');
    }

    // Insert new stakeholder profile
    const { error: insertError } = await adminClient
      .from('stakeholder')
      .insert({
        id: sessionUser.id,
        name,
        email,
        role: 'stakeholder',
      });

    if (insertError) {
      console.error('Profile creation failed:', insertError);
      await supabase.auth.signOut();
      return redirectToLoginWithError('profile_creation_failed', insertError.message);
    }

    return redirectWithCookies(next || dashboardRouteForRole('stakeholder'));
  } catch (error) {
    console.error('Unexpected profile provisioning error:', error);
    await supabase.auth.signOut();
    return redirectToLoginWithError('profile_creation_failed', errorMessage(error));
  }
}
