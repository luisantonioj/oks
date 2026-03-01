// proxy.ts
import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle Admin Route Protection (Replaces your layout.tsx check)
  if (pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('oks_admin_session')?.value;

    if (adminSession !== 'authenticated') {
      // Redirect to login if not authenticated
      const url = request.nextUrl.clone();
      url.pathname = '/login-admin';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }
    
    // If authenticated, allow the request to proceed without triggering Supabase auth
    return NextResponse.next();
  }

  // 2. Allow login-admin page to load without Supabase auth interference
  if (pathname === '/login-admin') {
    return NextResponse.next();
  }

  // 3. For all other routes (Offices, Stakeholders), use Supabase session management
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};