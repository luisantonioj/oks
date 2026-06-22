// lib/supabase/proxy.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If the env vars are not set, skip proxy check. You can remove this
  // once you setup the project.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const { pathname } = request.nextUrl;
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/login-office") ||
    pathname.startsWith("/login-portal") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/callback") ||
    pathname.startsWith("/confirm") ||
    pathname.startsWith("/error") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/update-password") ||
    pathname === "/";

  // 1. If not logged in and trying to access protected paths:
  if (!user && !isAuthPage) {
    const url = request.nextUrl.clone();
    if (pathname.startsWith("/portal")) {
      url.pathname = "/login-portal";
    } else if (pathname.startsWith("/office")) {
      url.pathname = "/login-office";
    } else {
      url.pathname = "/login";
    }
    return NextResponse.redirect(url);
  }

  // 2. If logged in, enforce RBAC
  if (user) {
    const role = user.app_metadata?.role;

    // Admin routing
    if (pathname.startsWith("/portal") && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/login-portal";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    // Office routing
    if (pathname.startsWith("/office") && role !== "office") {
      const url = request.nextUrl.clone();
      url.pathname = "/login-office";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    // Stakeholder routing
    if (pathname.startsWith("/stakeholder") && role !== "stakeholder") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    // If they are on an auth page, redirect them to their dashboard
    if (isAuthPage && pathname !== "/callback" && pathname !== "/confirm") {
      const url = request.nextUrl.clone();
      if (role === "admin") {
        url.pathname = "/portal/dashboard";
      } else if (role === "office") {
        url.pathname = "/office/dashboard";
      } else if (role === "stakeholder") {
        url.pathname = "/stakeholder/dashboard";
      } else {
        url.pathname = "/login";
      }
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

