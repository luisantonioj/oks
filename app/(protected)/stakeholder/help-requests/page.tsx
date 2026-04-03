import { getCurrentUserProfile } from '@/lib/queries/user';
import { getStakeholderHelpRequests } from '@/lib/queries/help-request';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { HelpRequestTable } from '@/components/HelpRequestTable';
import { SOSButton } from '@/components/SOSButton';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Plus } from 'lucide-react';

export default async function StakeholderHelpRequestsPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'stakeholder') redirect('/login');

  const requests = await getStakeholderHelpRequests(profile.id);
  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Emergency Requests
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {requests.length === 0 ? 'No requests submitted yet.' : `${requests.length} total · ${pendingCount} pending`}
          </p>
        </div>
        <Link href="/stakeholder/help-requests/new">
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white gap-1.5">
            <Plus className="h-4 w-4" />New SOS
          </Button>
        </Link>
      </div>

      {pendingCount === 0 && (
        <div className="rounded-xl border-2 border-dashed border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/10 p-8 flex flex-col items-center gap-4">
          <p className="text-sm font-medium text-muted-foreground text-center">Need immediate help? Tap the SOS button</p>
          <SOSButton />
        </div>
      )}

      <HelpRequestTable requests={requests} viewMode="stakeholder" />
    </div>
  );
}