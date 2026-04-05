// proxy.ts
import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Always update the session first
  const response = await updateSession(request);

  // 1. Allow the admin login page to render without interference
  if (pathname === '/login-portal') {
    return response;
  }

  // 2. Strictly Protect Admin Routes
  if (pathname.startsWith('/portal')) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If no user is logged in at all, kick them out
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login-portal';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }

    // Since auth.ts verified their admin status during login, 
    // and RLS protects the actual data, we just pass them through here.
    return response;
  }

  // 3. Standard Supabase Session Management for Stakeholders and Offices
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};