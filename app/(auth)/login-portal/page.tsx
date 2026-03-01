// app/(auth)/login-portal/page.tsx
import { AdminLoginForm } from "@/components/admin-login-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPortalPage() {
  // 1. Session Checks (Zero-Flash Redirects)
  const cookieStore = await cookies();
  if (cookieStore.get('oks_admin_session')?.value === 'authenticated') {
    redirect('/portal/dashboard');
  }

  // 2. Render Split-Screen Login
  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full">
      {/* Left Side - Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-red-600">Admin Access</h1>
            <p className="text-sm text-muted-foreground">Authorized personnel only.</p>
          </div>
          
          <AdminLoginForm />
        </div>
      </div>

      {/* Right Side - Placeholder for Frontend Developer */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-red-50/30 dark:bg-red-950/20 items-center justify-center p-10 border-l border-border/50">
        <div className="w-full max-w-lg text-center space-y-8">
          {/* Dashed Placeholder Box (Red-tinted for Admin theme) */}
          <div className="relative w-full aspect-[4/3] rounded-2xl bg-background/50 flex flex-col items-center justify-center border-2 border-dashed border-red-500/40 p-8 shadow-sm">
            <p className="text-lg font-semibold text-red-500/70">
              [ Frontend Dev ]
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Insert Secure Portal Graphic or Admin Dashboard Preview Here
            </p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">System Administration</h2>
            <p className="text-muted-foreground">
              Manage overall platform settings, monitor activity, and oversee institutional response data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}