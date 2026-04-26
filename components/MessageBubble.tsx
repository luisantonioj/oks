//components/MessageBubble.tsx
import { Message } from '@/lib/queries/message';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const date = new Date(message.created_at).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={cn('flex flex-col gap-1 max-w-[80%]', isOwn ? 'ml-auto items-end' : 'items-start')}>
      <div className={cn(
        'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
        isOwn
          ? 'bg-red-600 text-white rounded-br-sm'
          : 'bg-muted border border-border text-foreground rounded-bl-sm'
      )}>
        {!isOwn && (
          <p className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
            {message.sender_role === 'office' ? '🏢 Office' : 'You'}
          </p>
        )}
        <p>{message.content}</p>
      </div>
      <p className="text-[10px] text-muted-foreground px-1">{date} · {time}</p>
    </div>
  );
}
