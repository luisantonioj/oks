// proxy.ts
import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Strictly Protect Admin Routes
  if (pathname.startsWith('/portal')) {
    const adminSession = request.cookies.get('oks_admin_session')?.value;

    if (adminSession !== 'authenticated') {
      const url = request.nextUrl.clone();
      url.pathname = '/login-portal';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }
    
    return NextResponse.next(); // Let authenticated admins through
  }

  // 2. Allow the admin login page to render without Supabase interference
  if (pathname === '/login-portal') {
    return NextResponse.next();
  }

  // 3. Standard Supabase Session Management for Stakeholders and Offices
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};