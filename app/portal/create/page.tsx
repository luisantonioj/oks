import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CreateOfficeForm } from '@/components/create-office-form';
import { ArrowLeft, Building2 } from 'lucide-react';

export default async function AdminCreateOfficePage() {
  const cookieStore = await cookies();
  if (cookieStore.get('oks_admin_session')?.value !== 'authenticated') redirect('/login-portal');

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      <Link href="/portal/offices" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
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