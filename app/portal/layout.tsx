// app/admin/layout.tsx
import { adminSignOut } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

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