// app/admin/dashboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from "next/link";

export default async function AdminDashboard() {
  // Verify admin cookie
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('oks_admin_session')?.value;

  // debug
  console.log('Admin session cookie:', adminSession);

  if (adminSession !== 'authenticated') {
    redirect('/login-admin');
  }

  const adminName = process.env.ADMIN_NAME || 'Administrator';

  return (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {adminName}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link 
          href="/admin/create-office"
          className="p-6 border rounded-lg hover:bg-accent transition"
        >
          <h2 className="text-xl font-semibold mb-2">Create Office Account</h2>
          <p className="text-sm text-muted-foreground">
            Add new office accounts to the system
          </p>
        </Link>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
          <p className="text-sm text-muted-foreground">
            View and manage all system users
          </p>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">System Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure system-wide settings
          </p>
        </div>
      </div>
    </div>
  );
}