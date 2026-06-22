import { getCurrentUserProfile } from '@/lib/queries/user';
import { getInboxThreads } from '@/lib/queries/message';
import { redirect } from 'next/navigation';
import { InboxThreadCard } from '@/features/inbox/InboxThreadCard';
import { MessageSquare } from 'lucide-react';

export default async function StakeholderInboxPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'stakeholder') redirect('/login');

  const threads = await getInboxThreads(profile.id, 'stakeholder');

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-red-500" />
          Inbox
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Updates from offices responding to your requests.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {threads.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center px-4">
            <MessageSquare className="h-10 w-10 text-muted-foreground/30" />
            <p className="font-medium text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Once you submit a help request, offices can send you updates here.
            </p>
          </div>
        ) : (
          threads.map((thread) => {
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
                role="stakeholder"
              />
            );
          })
        )}
      </div>
    </div>
  );
}
