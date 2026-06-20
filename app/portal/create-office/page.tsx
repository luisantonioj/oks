// app/admin/create-office/page.tsx
import { redirect } from "next/navigation";
import { CreateOfficeForm } from "@/components/create-office-form";
import { getCurrentUserProfile } from "@/lib/queries/user";

export default async function CreateOfficePage() {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== 'admin') {
    redirect('/login-portal');
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