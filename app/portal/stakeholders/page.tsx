import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAllStakeholders } from '@/lib/queries/user';
import { Users, Mail, Calendar, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function AdminStakeholdersPage() {
  const cookieStore = await cookies();
  if (cookieStore.get('oks_admin_session')?.value !== 'authenticated') redirect('/login-portal');

  const stakeholders = await getAllStakeholders();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-purple-500" />Stakeholders
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{stakeholders.length} registered stakeholder{stakeholders.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stakeholders.length, color: 'text-foreground' },
          {
            label: 'This Month',
            value: stakeholders.filter((s: any) => {
              const d = new Date(s.created_at); const n = new Date();
              return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
            }).length,
            color: 'text-blue-600',
          },
          { label: 'With Contact', value: stakeholders.filter((s: any) => s.contact).length, color: 'text-green-600' },
          { label: 'With Address', value: stakeholders.filter((s: any) => s.current_address).length, color: 'text-purple-600' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-card p-4 text-center shadow-sm">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {stakeholders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center border-2 border-dashed rounded-lg">
          <Users className="h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">No stakeholders registered yet</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  {['Name', 'Email', 'Community', 'Contact', 'Registered'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {stakeholders.map((s: any) => (
                  <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center flex-shrink-0 text-xs font-bold text-purple-600">
                          {s.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium leading-tight">{s.name}</p>
                          {s.age && <p className="text-xs text-muted-foreground">Age {s.age}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1.5 text-muted-foreground text-xs"><Mail className="h-3 w-3" /><span className="truncate max-w-[180px]">{s.email}</span></div></td>
                    <td className="px-4 py-3">
                      {s.community ? <Badge variant="outline" className="text-xs font-normal">{s.community}</Badge> : <span className="text-xs text-muted-foreground/60 italic">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {s.contact ? <div className="flex items-center gap-1.5 text-muted-foreground text-xs"><Phone className="h-3 w-3" />{s.contact}</div> : <span className="text-xs text-muted-foreground/60 italic">—</span>}
                    </td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1.5 text-muted-foreground text-xs"><Calendar className="h-3 w-3" />{formatDate(s.created_at)}</div></td>
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