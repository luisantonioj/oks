// app/portal/create/page.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CreateOfficeForm } from '@/features/admin/CreateOfficeForm';
import { ArrowLeft, Building2 } from 'lucide-react';
import { getCurrentUserProfile } from '@/lib/queries/user';
import { routes } from '@/lib/routes';

export default async function AdminCreateOfficePage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'admin') {
    redirect(routes.auth.login.admin);
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      <Link href={routes.admin.offices} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="h-4 w-4" /> Back to Offices
      </Link>
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-500" />Create Office Account
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Add a new office staff member to the system.</p>
      </div>
      <CreateOfficeForm />
    </div>
  );
}
