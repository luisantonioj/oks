// middleware.ts
import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow the admin login page to render without Supabase interference
  if (pathname === '/login-portal') {
    return NextResponse.next();
  }

  // 2. Standard Supabase Session Management for all roles
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};