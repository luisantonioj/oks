// app/page.tsx
import { LoginForm } from "@/components/login-form";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { EnvVarWarning } from "@/components/env-var-warning";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <nav className="w-full border-b border-b-foreground/10 h-16 flex items-center px-6">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-2 items-center font-semibold text-xl">
            <span>OKS!</span>
          </div>
          <ThemeSwitcher />
        </div>
      </nav>

      {/* Main Content - Split Screen */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <div className="space-y-6">
                  <LoginForm />
                  
                  {/* Additional Login Options */}
                  <div className="flex flex-col gap-2 text-center text-sm">
                    <Link 
                      href="/login-office" 
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Login as Office Staff
                    </Link>
                    <Link 
                      href="/login-admin" 
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Admin Access
                    </Link>
                  </div>
                </div>
              </Suspense>
            )}
          </div>
        </div>

        {/* Right Side - Image/Branding Area */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-muted items-center justify-center p-10">
          <div className="max-w-lg text-center space-y-6">
            {/* Placeholder for your landing page image */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              {/* Replace this with your actual image */}
              <div className="text-center space-y-4 p-8">
                <h1 className="text-4xl font-bold tracking-tight">
                  Operation Keep Safe
                </h1>
                <p className="text-lg text-muted-foreground">
                  Enhancing Crisis Management for De La Salle Lipa
                </p>
              </div>
              {/* Uncomment when you have an image
              <Image
                src="/landing-image.png"
                alt="OKS Landing"
                fill
                className="object-cover"
                priority
              />
              */}
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">
                Stay Safe. Stay Connected.
              </h2>
              <p className="text-muted-foreground">
                Report your safety status, access emergency assistance, and stay informed during crisis situations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t py-4 px-6">
        <div className="w-full max-w-7xl mx-auto text-center text-xs text-muted-foreground">
          <p>© 2026 Operation Keep Safe (OKS!) - De La Salle Lipa</p>
        </div>
      </footer>
    </main>
  );
}