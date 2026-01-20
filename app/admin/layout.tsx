// app/admin/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminSignOut } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('oks_admin_session')?.value;

  if (adminSession !== 'authenticated') {
    redirect('/login-admin?error=unauthorized');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="font-semibold text-lg">OKS! Admin</div>
          <form action={adminSignOut}>
            <Button type="submit" variant="outline" size="sm">
              Logout
            </Button>
          </form>
        </div>
      </nav>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}