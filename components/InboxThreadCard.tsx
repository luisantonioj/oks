//components/InboxThreadCard.tsx
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface InboxThreadCardProps {
  requestId: string;
  crisisType: string;
  location: string;
  status: string;
  lastMessage?: { content: string; sender_role: string; created_at: string } | null;
  role: 'stakeholder' | 'office';
  stakeholderName?: string;
}

export function InboxThreadCard({
  requestId,
  crisisType,
  location,
  status,
  lastMessage,
  role,
  stakeholderName,
}: InboxThreadCardProps) {
  const href = role === 'stakeholder'
    ? `/stakeholder/inbox/${requestId}`
    : `/office/inbox/${requestId}`;

  const statusColor = {
    pending: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
    resolved: 'bg-green-500/15 text-green-700 dark:text-green-400',
  }[status] ?? 'bg-muted text-muted-foreground';

  const timeAgo = lastMessage
    ? new Date(lastMessage.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
    : null;

  return (
    <Link href={href}>
      <div className="flex items-start gap-3 px-4 py-4 hover:bg-muted/30 transition-colors border-b border-border last:border-0 cursor-pointer">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-destructive/15 border border-destructive/20 flex items-center justify-center flex-shrink-0 text-destructive font-bold text-sm">
          SOS
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className="text-sm font-semibold truncate">
              {role === 'office' && stakeholderName ? stakeholderName : crisisType}
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', statusColor)}>
                {status}
              </span>
              {timeAgo && <span className="text-[10px] text-muted-foreground">{timeAgo}</span>}
            </div>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {lastMessage
              ? `${lastMessage.sender_role === 'office' ? '🏢 Office: ' : 'You: '}${lastMessage.content}`
              : `📍 ${location}`}
          </p>
        </div>
      </div>
    </Link>
  );
}