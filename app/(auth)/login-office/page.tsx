// app/(auth)/login-office/page.tsx
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { EnvVarWarning } from "@/components/env-var-warning";

export default function OfficeLogin() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-13">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <p>OKS!</p>
            </div>
            {/* No AuthButton in nav */}
          </div>
        </nav>
        <div className="flex-1 w-full flex flex-col items-center justify-center gap-4">
          {/* {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense>
              <AuthButton />
            </Suspense>
          )} */}
          <Link href="/" className="text-sm text-blue-500 hover:underline">
            Login as Student/Teacher
          </Link>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-5">
          <p>Operation Keep Safe (OKS!) Footer</p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}