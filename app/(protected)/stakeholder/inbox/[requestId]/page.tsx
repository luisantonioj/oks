//app/(protected)/stakeholder/inbox/[requestId]/page.tsx
import { getCurrentUserProfile } from '@/lib/queries/user';
import { getMessages } from '@/lib/queries/message';
import { redirect } from 'next/navigation';
import { MessageBubble } from '@/components/MessageBubble';
import { ChatInput } from '@/components/ChatInput';
import { ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

interface PageProps {
  params: Promise<{ requestId: string }>;
}

export default async function StakeholderChatPage({ params }: PageProps) {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'stakeholder') redirect('/login');

  const { requestId } = await params;
  const supabase = await createClient();

  const { data: request } = await supabase
    .from('help_request')
    .select('id, location, status, stakeholder_id')
    .eq('id', requestId)
    .eq('stakeholder_id', profile.id)
    .single();

  if (!request) redirect('/stakeholder/inbox');

  const messages = await getMessages(requestId);

  const statusColor = {
    pending: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    resolved: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20',
  }[request.status as string] ?? 'bg-muted text-muted-foreground border-border';

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-80px)]">
      <div className="px-4 py-4 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <Link href="/stakeholder/inbox" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Emergency Request</p>
            <p className="text-xs text-muted-foreground">Response thread</p>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColor}`}>
            {request.status}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-xl px-3 py-2.5 border border-border/50">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{request.location}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-background">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <p className="text-sm text-muted-foreground">No messages yet.</p>
            <p className="text-xs text-muted-foreground">An office will respond to your request shortly.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} isOwn={msg.sender_id === profile.id} />
          ))
        )}
      </div>

      <ChatInput helpRequestId={requestId} senderRole="stakeholder" />
    </div>
  );
}