// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserProfile } from '@/lib/queries/user';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');

  // Basic validation of params
  if (!token_hash || !['signup', 'recovery', 'invite'].includes(type || '')) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('error', 'invalid_link');
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = await createClient();

  // Verify and confirm the OTP / magic link
  const { error, data } = await supabase.auth.verifyOtp({
    token_hash: token_hash!,
    type: type as any, // Supabase types are flexible here
  });

  if (error) {
    console.error('OTP verification failed:', error);
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('error', 'confirmation_failed');
    redirectUrl.searchParams.set('message', error.message || 'Link expired or invalid');
    return NextResponse.redirect(redirectUrl);
  }

  // Success: user is now confirmed & signed in
  // Redirect based on role (safe fallback to stakeholder if role fetch fails)
  const profile = await getCurrentUserProfile(); // reuse your existing function

  let redirectPath = '/protected/stakeholder/dashboard'; // default

  if (profile) {
    switch (profile.role) {
      case 'admin':
        redirectPath = '/protected/admin/dashboard';
        break;
      case 'office':
        redirectPath = '/protected/office/dashboard';
        break;
      case 'stakeholder':
        redirectPath = '/protected/stakeholder/dashboard';
        break;
    }
  }

  return NextResponse.redirect(new URL(redirectPath, request.url));
}