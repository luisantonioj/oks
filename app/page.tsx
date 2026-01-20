// app/page.tsx
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { EnvVarWarning } from "@/components/env-var-warning";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-13">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <p>OKS!</p>
            </div>
          </div>
        </nav>
        <div className="flex-1 w-full flex flex-col items-center justify-center gap-4">
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense>
              <AuthButton />
            </Suspense>
          )}
          <div className="flex flex-col gap-2 text-center">
            <Link href="/login-office" className="text-sm text-blue-500 hover:underline">
              Login as Office
            </Link>
            <Link href="/login-admin" className="text-sm text-blue-500 hover:underline">
              Admin Access
            </Link>
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-5">
          <p>Operation Keep Safe (OKS!) Footer</p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}