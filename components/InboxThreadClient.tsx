// components/InboxThreadClient.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MessageBubble } from "@/components/MessageBubble";
import type { Message } from "@/lib/queries/message";

interface Props {
  initialMessages: Message[];
  requestId: string;
  currentUserId: string;
  emptyText?: string;
  emptySubtext?: string;
}

export function InboxThreadClient({
  initialMessages,
  requestId,
  currentUserId,
  emptyText = "No messages yet.",
  emptySubtext,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Subscribe to new messages via Supabase Realtime
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`inbox:${requestId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message",
          filter: `help_request_id=eq.${requestId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            // Avoid duplicates if the sender's own revalidatePath also triggers a re-render
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId]);

  // Scroll to bottom on initial load
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-background">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="text-sm text-muted-foreground">{emptyText}</p>
          {emptySubtext && <p className="text-xs text-muted-foreground">{emptySubtext}</p>}
        </div>
      ) : (
        messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isOwn={msg.sender_id === currentUserId} />
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
}
