//app/(protected)/office/help-requests/page.tsx
import { getCurrentUserProfile } from '@/lib/queries/user';
import { getAllHelpRequests } from '@/lib/queries/help-request';
import { redirect } from 'next/navigation';
import { HelpRequestTable } from '@/components/HelpRequestTable';
import { AlertTriangle, Activity } from 'lucide-react';

export default async function OfficeHelpRequestsPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'office') redirect('/login-office');

  const [allRequests, pendingRequests] = await Promise.all([
    getAllHelpRequests(),
    getAllHelpRequests({ status: 'pending' }),
  ]);

  const resolvedCount = allRequests.length - pendingRequests.length;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          Help Requests
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor and respond to stakeholder emergency requests.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: allRequests.length, color: "text-foreground" },
          { label: "Pending", value: pendingRequests.length, color: pendingRequests.length > 0 ? "text-orange-600" : "text-foreground" },
          { label: "Resolved", value: resolvedCount, color: "text-green-600" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-card p-4 text-center shadow-sm">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {pendingRequests.length > 0 && (
        <div className="flex items-center gap-2 text-sm font-medium text-orange-600 bg-orange-50 dark:bg-orange-950/20 rounded-lg px-4 py-2.5 border border-orange-200 dark:border-orange-900/40">
          <Activity className="h-4 w-4 animate-pulse" />
          {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''} need attention
        </div>
      )}

      <div className="space-y-6">
        {pendingRequests.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-orange-600 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Pending Requests
            </h2>
            <HelpRequestTable requests={pendingRequests} viewMode="office" />
          </section>
        )}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            All Requests
          </h2>
          <HelpRequestTable requests={allRequests} viewMode="office" />
        </section>
      </div>
    </div>
  );
}
