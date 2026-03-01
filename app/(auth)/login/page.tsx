// app/(auth)/login/page.tsx
import { LoginForm } from "@/components/login-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/queries/user";
import Link from "next/link";
import { Suspense } from "react";
import { EnvVarWarning } from "@/components/env-var-warning";
import { hasEnvVars } from "@/lib/utils";

export default async function LoginPage() {
  // 1. Session Checks (Zero-Flash Redirects)
  const cookieStore = await cookies();
  if (cookieStore.get('oks_admin_session')?.value === 'authenticated') {
    redirect('/portal/dashboard');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const profile = await getCurrentUserProfile();
    if (profile?.role === 'office') redirect('/office/dashboard');
    if (profile?.role === 'stakeholder') redirect('/stakeholder/dashboard');
  }

  // 2. Render Split-Screen Login
  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full">
      {/* Left Side - Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your Stakeholder account</p>
          </div>

          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense>
              <LoginForm />
            </Suspense>
          )}

          {/* Cleaned up navigation links */}
          <div className="flex flex-col gap-3 text-center text-sm mt-4">
            <div className="flex flex-col gap-2 mt-2">
              <Link href="/login-office" className="text-muted-foreground hover:text-foreground transition-colors">
                Login as Office Staff
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Placeholder for Frontend Developer */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-muted items-center justify-center p-10 border-l border-border/50">
        <div className="w-full max-w-lg text-center space-y-8">
          {/* Dashed Placeholder Box */}
          <div className="relative w-full aspect-square rounded-2xl bg-background/50 flex flex-col items-center justify-center border-2 border-dashed border-primary/30 p-8 shadow-sm">
            <p className="text-lg font-semibold text-primary/60">
              [ Frontend Dev ]
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Insert Stakeholder Illustration or Branding Graphic Here
            </p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Stakeholder Portal</h2>
            <p className="text-muted-foreground">
              Access emergency tools, report incidents, and stay updated during crisis situations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}