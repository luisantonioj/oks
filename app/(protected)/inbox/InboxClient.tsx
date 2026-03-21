"use client";

import { useState, useCallback } from "react";
import { NotificationItem, NotificationEmptyState, Notification, NotificationType } from "@/components/NotificationItem";
import { Announcement } from "@/types/database";
import { Crisis } from "@/types/database";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InboxClientProps {
  announcements: Announcement[];
  crises: Crisis[];
  userRole: string;
}

function buildNotifications(announcements: Announcement[], crises: Crisis[], readIds: Set<string>): Notification[] {
  const notifications: Notification[] = [];

  for (const crisis of crises) {
    notifications.push({
      id: `crisis-${crisis.id}`,
      type: "crisis" as NotificationType,
      title: `Active Crisis: ${crisis.type}`,
      message: `${crisis.summary} — Affected areas: ${crisis.affected_areas}. Severity: ${crisis.severity.toUpperCase()}.`,
      read: readIds.has(`crisis-${crisis.id}`),
      created_at: crisis.created_at,
    });
  }

  for (const ann of announcements) {
    const isUrgent = ann.priority === "urgent" || ann.priority === "high";
    notifications.push({
      id: `ann-${ann.id}`,
      type: isUrgent ? "crisis" : ("announcement" as NotificationType),
      title: ann.title,
      message: ann.content,
      read: readIds.has(`ann-${ann.id}`),
      created_at: ann.created_at,
    });
  }

  notifications.sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return notifications;
}

type FilterType = "all" | "unread" | "crisis" | "announcement";

export function InboxClient({ announcements, crises, userRole }: InboxClientProps) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterType>("all");

  const notifications = buildNotifications(announcements, crises, readIds);
  const handleMarkRead = useCallback((id: string) => { setReadIds((prev) => new Set([...prev, id])); }, []);
  const handleMarkAllRead = () => { setReadIds(new Set(notifications.map((n) => n.id))); };
  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "crisis") return n.type === "crisis";
    if (filter === "announcement") return n.type === "announcement";
    return true;
  });

  const filterLabels: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "unread", label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
    { key: "crisis", label: "Crisis" },
    { key: "announcement", label: "Announcements" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-500" />
            Inbox
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-blue-500 text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {notifications.length} notification{notifications.length !== 1 ? "s" : ""}{unreadCount > 0 ? ` · ${unreadCount} unread` : ""}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-1.5 text-xs">
            <CheckCheck className="h-3.5 w-3.5" />Mark all read
          </Button>
        )}
      </div>

      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/60 border w-fit">
        {filterLabels.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
              filter === key ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? <NotificationEmptyState /> : filtered.map((n) => (
          <NotificationItem key={n.id} notification={n} onMarkRead={handleMarkRead} />
        ))}
      </div>

      {userRole === "stakeholder" && (
        <p className="text-xs text-muted-foreground text-center pb-2">
          Showing announcements and crisis alerts relevant to you.{" "}
          <a href="/stakeholder/help-requests/new" className="underline text-red-500 font-medium">Need emergency help?</a>
        </p>
      )}
    </div>
  );
}
