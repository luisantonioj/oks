// features/shell/DashboardRealtimeWatcher.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@/types/user";

type RealtimeTable = "crisis" | "announcement" | "survey" | "help_request";

interface RealtimeSubscription {
  table: RealtimeTable;
  filter?: string;
}

interface DashboardRealtimeWatcherProps {
  role: Extract<UserRole, "office" | "stakeholder">;
  userId: string;
}

const REFRESH_DEBOUNCE_MS = 750;

function getDashboardSubscriptions({
  role,
  userId,
}: DashboardRealtimeWatcherProps): RealtimeSubscription[] {
  if (role === "office") {
    return [
      { table: "crisis", filter: `office_id=eq.${userId}` },
      { table: "announcement", filter: `office_id=eq.${userId}` },
      { table: "survey", filter: `office_id=eq.${userId}` },
      { table: "help_request" },
    ];
  }

  return [
    { table: "crisis" },
    { table: "announcement" },
    { table: "survey" },
    { table: "help_request", filter: `stakeholder_id=eq.${userId}` },
  ];
}

export function DashboardRealtimeWatcher({ role, userId }: DashboardRealtimeWatcherProps) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleRefresh = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        router.refresh();
      }, REFRESH_DEBOUNCE_MS);
    };

    const channel = getDashboardSubscriptions({ role, userId }).reduce(
      (currentChannel, subscription) =>
        currentChannel.on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: subscription.table,
            ...(subscription.filter ? { filter: subscription.filter } : {}),
          },
          scheduleRefresh,
        ),
      supabase.channel(`dashboard-realtime-watcher:${role}:${userId}`),
    );

    channel.subscribe();

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      supabase.removeChannel(channel);
    };
  }, [role, router, userId]);

  return null;
}
