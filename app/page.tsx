// app/page.tsx
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/queries/user";
import { Button } from "@/components/ui/button";

export default async function Home() {
  // 1. Redirect if Admin is already logged in
  const cookieStore = await cookies();
  if (cookieStore.get('oks_admin_session')?.value === 'authenticated') {
    redirect('/portal/dashboard');
  }

  // 2. Redirect if Stakeholder/Office is already logged in
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const profile = await getCurrentUserProfile();
    if (profile?.role === 'office') redirect('/office/dashboard');
    if (profile?.role === 'stakeholder') redirect('/stakeholder/dashboard');
  }

  // 3. Render Public Landing Page
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="w-full border-b border-b-foreground/10 h-16 flex items-center px-6">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-2 items-center font-semibold text-xl">
            <span>OKS!</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:underline">
              Login
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Operation Keep Safe
        </h1>
        <p className="text-xl text-muted-foreground">
          Enhancing Crisis Management for De La Salle Lipa. Report your safety status, access emergency assistance, and stay informed during crisis situations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto px-8">
              Get Started
            </Button>
          </Link>
          <Link href="/login-office">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
              Office Portal
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t py-6 px-6 mt-auto">
        <div className="w-full max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 Operation Keep Safe (OKS!) - De La Salle Lipa</p>
        </div>
      </footer>
    </main>
  );
}