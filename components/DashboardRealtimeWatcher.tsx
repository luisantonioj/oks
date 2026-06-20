// components/DashboardRealtimeWatcher.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DashboardRealtimeWatcher() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("dashboard-realtime-watcher")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "crisis" },
        () => {
          console.log("[DashboardRealtimeWatcher] Crisis table updated, refreshing...");
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcement" },
        () => {
          console.log("[DashboardRealtimeWatcher] Announcement table updated, refreshing...");
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "survey" },
        () => {
          console.log("[DashboardRealtimeWatcher] Survey table updated, refreshing...");
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "help_request" },
        () => {
          console.log("[DashboardRealtimeWatcher] Help request table updated, refreshing...");
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
