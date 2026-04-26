//app/(protected)/stakeholder/help-requests/new/page.tsx
import { getCurrentUserProfile } from '@/lib/queries/user';
import { getActiveCrises } from '@/lib/queries/crisis';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { HelpRequestForm } from '@/components/HelpRequestForm';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ crisis_id?: string }>;
}

export default async function NewHelpRequestPage({ searchParams }: PageProps) {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'stakeholder') redirect('/login');

  const [crises, params] = await Promise.all([getActiveCrises(), searchParams]);
  const defaultCrisisId = params.crisis_id;

  if (crises.length === 0) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-lg mx-auto">
        <Link href="/stakeholder/help-requests" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="flex flex-col items-center gap-4 py-16 text-center border rounded-lg bg-card">
          <AlertTriangle className="h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium">No active crises found</p>
          <p className="text-sm text-muted-foreground max-w-xs">Help requests can only be submitted during an active crisis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-lg mx-auto">
      <Link href="/stakeholder/help-requests" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="h-4 w-4" /> Back to My Requests
      </Link>
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          Request Emergency Help
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Submit an SOS request and our team will respond immediately.</p>
      </div>
      <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 px-4 py-3 text-sm text-red-700 dark:text-red-400 font-medium flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        For life-threatening emergencies, also call 911 immediately.
      </div>
      <div className="rounded-lg border bg-card shadow-sm p-6">
        <HelpRequestForm crises={crises} defaultCrisisId={defaultCrisisId} />
      </div>
    </div>
  );
}