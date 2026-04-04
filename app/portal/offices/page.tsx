import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAllOffices } from '@/lib/queries/user';
import Link from 'next/link';
import { Building2, Plus, Mail, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function AdminOfficesPage() {
  const cookieStore = await cookies();
  if (cookieStore.get('oks_admin_session')?.value !== 'authenticated') redirect('/login-portal');

  const offices = await getAllOffices();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-500" />Office Accounts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{offices.length} office account{offices.length !== 1 ? 's' : ''} registered</p>
        </div>
        <Link href="/portal/offices/create">
          <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Add Office</Button>
        </Link>
      </div>

      {offices.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center border-2 border-dashed rounded-lg">
          <Building2 className="h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">No office accounts yet</p>
          <Link href="/portal/offices/create">
            <Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Create first office account</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  {['Office', 'Staff Name', 'Email', 'Created', 'Status'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {offices.map((office: any) => (
                  <tr key={office.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <span className="font-medium">{office.office_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1.5 text-muted-foreground"><User className="h-3.5 w-3.5" />{office.name}</div></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1.5 text-muted-foreground"><Mail className="h-3.5 w-3.5" />{office.email}</div></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1.5 text-muted-foreground text-xs"><Calendar className="h-3.5 w-3.5" />{formatDate(office.created_at)}</div></td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50 dark:bg-green-950/20 text-xs">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}