import { getCurrentUserProfile } from '@/lib/queries/user';
import { getInboxThreads } from '@/lib/queries/message';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, ArrowRight, MapPin } from 'lucide-react';

export default async function StakeholderInboxPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'stakeholder') redirect('/login');

  const threads = await getInboxThreads(profile.id, 'stakeholder');

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Your help request conversations with campus offices.
        </p>
      </div>

      {threads.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center bg-card border border-border rounded-2xl px-6">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold">No messages yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Messages are only available for active help requests. Submit a help request during a crisis to start a conversation with an office.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {threads.map((thread: any) => {
            const messages = thread.message ?? [];
            const lastMessage = messages.at(-1);
            const statusColor =
              thread.status === 'pending'
                ? 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/20'
                : 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20';

            return (
              <Link key={thread.id} href={`/stakeholder/inbox/${thread.id}`}>
                <div className="bg-card border border-border rounded-2xl px-4 py-4 hover:shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold truncate">Emergency Request</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${statusColor}`}>
                        {thread.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{thread.location}</span>
                    </div>
                    {lastMessage ? (
                      <p className="text-xs text-muted-foreground truncate">
                        {lastMessage.sender_role === 'office' ? '🏢 Office: ' : 'You: '}
                        {lastMessage.content}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No messages yet — office will respond soon.</p>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}