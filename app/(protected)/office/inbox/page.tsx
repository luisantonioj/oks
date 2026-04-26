//app/(protected)/office/inbox/page.tsx
import { getCurrentUserProfile } from '@/lib/queries/user';
import { getInboxThreads } from '@/lib/queries/message';
import { redirect } from 'next/navigation';
import { InboxThreadCard } from '@/components/InboxThreadCard';
import { MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function OfficeInboxPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'office') redirect('/login-office');

  const threads = await getInboxThreads(profile.id, 'office');

  const supabase = await createClient();

  const threadsWithNames = await Promise.all(
    threads.map(async (thread: any) => {
      const { data: stakeholder } = await supabase
        .from('stakeholder')
        .select('name')
        .eq('id', thread.stakeholder_id)
        .single();
      return { ...thread, stakeholderName: stakeholder?.name ?? 'Unknown' };
    })
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-blue-500" />
          Help Request Inbox
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Communicate with stakeholders who submitted emergency requests.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {threadsWithNames.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center px-4">
            <MessageSquare className="h-10 w-10 text-muted-foreground/30" />
            <p className="font-medium text-muted-foreground">No active requests</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Help requests assigned to your office will appear here.
            </p>
          </div>
        ) : (
          threadsWithNames.map((thread: any) => {
            const messages = thread.message ?? [];
            const lastMessage = messages.length > 0
              ? messages[messages.length - 1]
              : null;

            return (
              <InboxThreadCard
                key={thread.id}
                requestId={thread.id}
                crisisType={thread.crisis_id}
                location={thread.location}
                status={thread.status}
                lastMessage={lastMessage}
                role="office"
                stakeholderName={thread.stakeholderName}
              />
            );
          })
        )}
      </div>
    </div>
  );
}