import { Bell, AlertTriangle, Megaphone, ClipboardList, CheckCircle2, Info } from "lucide-react";

export type NotificationType = "crisis" | "announcement" | "survey" | "help_request" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  link?: string;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
}

const iconMap: Record<NotificationType, React.ReactNode> = {
  crisis: <AlertTriangle className="h-4 w-4 text-red-500" />,
  announcement: <Megaphone className="h-4 w-4 text-blue-500" />,
  survey: <ClipboardList className="h-4 w-4 text-purple-500" />,
  help_request: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  system: <Info className="h-4 w-4 text-muted-foreground" />,
};

const bgMap: Record<NotificationType, string> = {
  crisis: "bg-red-50 dark:bg-red-950/20",
  announcement: "bg-blue-50 dark:bg-blue-950/20",
  survey: "bg-purple-50 dark:bg-purple-950/20",
  help_request: "bg-green-50 dark:bg-green-950/20",
  system: "bg-muted/40",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const Wrapper = notification.link ? "a" : "div";
  const wrapperProps = notification.link ? { href: notification.link } : {};

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className={`
        block rounded-lg border transition-all duration-200
        ${notification.read ? "bg-card" : bgMap[notification.type]}
        ${notification.link ? "hover:border-primary/30 hover:shadow-sm cursor-pointer" : ""}
      `}
      onClick={() => !notification.read && onMarkRead?.(notification.id)}
    >
      <div className="flex gap-3 p-4">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${
          notification.read ? "bg-muted border-border" : "bg-white dark:bg-background border-border/50 shadow-sm"
        }`}>
          {iconMap[notification.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className={`text-sm font-semibold leading-tight ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                {notification.title}
              </h4>
              {!notification.read && (
                <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
              )}
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">{timeAgo(notification.created_at)}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{notification.message}</p>
        </div>
      </div>
    </Wrapper>
  );
}

export function NotificationEmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <Bell className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="font-medium text-muted-foreground">All caught up!</p>
      <p className="text-sm text-muted-foreground/60">No new notifications at this time.</p>
    </div>
  );
}