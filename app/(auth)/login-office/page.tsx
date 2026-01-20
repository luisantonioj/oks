// app/(auth)/login-office/page.tsx
import { OfficeLoginForm } from "@/components/office-login-form";

export default function OfficeLoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <OfficeLoginForm />
      </div>
    </div>
  );
}