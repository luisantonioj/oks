// proxy.ts
import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = await updateSession(request);

  // 1. Strictly Protect Admin Routes
  if (pathname.startsWith('/portal')) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login-portal';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }

    // Verify Admin Privileges
    let isAuthorized = false;

    // Check Pure Admin
    const { data: admin } = await supabase.from("admin").select("id").eq("id", user.id).maybeSingle();
    if (admin) isAuthorized = true;

    // Check Dual-Role Office
    if (!isAuthorized) {
      const { data: office } = await supabase.from("office").select("is_admin").eq("id", user.id).maybeSingle();
      if (office?.is_admin) isAuthorized = true;
    }

    if (!isAuthorized) {
      const url = request.nextUrl.clone();
      url.pathname = '/login-portal';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }

    return response;
  }

  // 2. Allow the admin login page to render without Supabase interference
  if (pathname === '/login-portal') {
    return NextResponse.next();
  }

  // 3. Standard Supabase Session Management for Stakeholders and Offices
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};