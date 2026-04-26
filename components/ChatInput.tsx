//components/ChatInput.tsx
'use client';

import { useRef, useState, useTransition } from 'react';
import { sendMessage } from '@/app/actions/message';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  helpRequestId: string;
  senderRole: 'stakeholder' | 'office';
}

export function ChatInput({ helpRequestId, senderRole }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setError(null);

    const formData = new FormData();
    formData.set('help_request_id', helpRequestId);
    formData.set('content', value.trim());
    formData.set('sender_role', senderRole);

    startTransition(async () => {
      const result = await sendMessage(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setValue('');
        formRef.current?.reset();
      }
    });
  }

  return (
    <div className="border-t border-border bg-card px-4 py-3">
      {error && (
        <p className="text-xs text-destructive mb-2">{error}</p>
      )}
      <form ref={formRef} onSubmit={handleSubmit} className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as any);
            }
          }}
          placeholder="Type a message… (Enter to send)"
          rows={1}
          className="flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[40px] max-h-[120px] overflow-y-auto"
          style={{ height: 'auto' }}
          disabled={isPending}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isPending || !value.trim()}
          className="h-10 w-10 rounded-xl bg-red-600 hover:bg-red-700 flex-shrink-0"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}