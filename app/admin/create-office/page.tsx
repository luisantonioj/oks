// app/admin/create-office/page.tsx
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { CreateOfficeForm } from "@/components/create-office-form";

export default async function CreateOfficePage() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('oks_admin_session')?.value;

  if (adminSession !== 'authenticated') {
    redirect('/login-admin');
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Create Office Account</h1>
        <p className="text-muted-foreground">Add a new office to the system</p>
      </div>

      <CreateOfficeForm />
    </div>
  );
}