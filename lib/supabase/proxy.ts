// lib/supabase/proxy.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";
import { dashboardRouteForRole, loginRouteForRole, routes, type AppRole } from "@/lib/routes";

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
    pathname.startsWith(routes.auth.login.stakeholder) ||
    pathname.startsWith(routes.auth.login.office) ||
    pathname.startsWith(routes.auth.login.admin) ||
    pathname.startsWith(routes.auth.signUp) ||
    pathname.startsWith(routes.auth.callback) ||
    pathname.startsWith(routes.auth.confirm) ||
    pathname.startsWith(routes.auth.error) ||
    pathname.startsWith(routes.auth.forgotPassword) ||
    pathname.startsWith(routes.auth.updatePassword) ||
    pathname === routes.home;

  // 1. If not logged in and trying to access protected paths:
  if (!user && !isAuthPage) {
    const url = request.nextUrl.clone();
    if (pathname.startsWith(routes.admin.root)) {
      url.pathname = loginRouteForRole("admin");
    } else if (pathname.startsWith(routes.office.root)) {
      url.pathname = loginRouteForRole("office");
    } else {
      url.pathname = loginRouteForRole("stakeholder");
    }
    return NextResponse.redirect(url);
  }

  // 2. If logged in, enforce RBAC
  if (user) {
    const role = user.app_metadata?.role as AppRole | undefined;

    // Admin routing
    if (pathname.startsWith(routes.admin.root) && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = loginRouteForRole("admin");
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    // Office routing
    if (pathname.startsWith(routes.office.root) && role !== "office") {
      const url = request.nextUrl.clone();
      url.pathname = loginRouteForRole("office");
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    // Stakeholder routing
    if (pathname.startsWith(routes.stakeholder.root) && role !== "stakeholder") {
      const url = request.nextUrl.clone();
      url.pathname = loginRouteForRole("stakeholder");
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    // If they are on an auth page, redirect them to their dashboard
    if (isAuthPage && pathname !== routes.auth.callback && pathname !== routes.auth.confirm) {
      const url = request.nextUrl.clone();
      if (role === "admin" || role === "office" || role === "stakeholder") {
        url.pathname = dashboardRouteForRole(role);
      } else {
        url.pathname = loginRouteForRole("stakeholder");
      }
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
