import { Bell, BellRing, X, AlertTriangle, Clock, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TaskReminder } from "@/hooks/useTaskNotifications";

interface NotificationBellProps {
  reminders: TaskReminder[];
  unreadCount: number;
  onDismiss: (id: string) => void;
  onOpen: () => void;
}

function getReminderIcon(type: TaskReminder["type"]) {
  switch (type) {
    case "overdue":
      return <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" />;
    case "due-soon":
      return <Clock className="w-3.5 h-3.5 text-primary shrink-0" />;
    case "due-today":
      return <CalendarClock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />;
  }
}

export function NotificationBell({ reminders, unreadCount, onDismiss, onOpen }: NotificationBellProps) {
  const hasReminders = reminders.length > 0;

  return (
    <Popover onOpenChange={(open) => open && onOpen()}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-lg relative">
          {hasReminders ? (
            <BellRing className="w-4 h-4 animate-wiggle" />
          ) : (
            <Bell className="w-4 h-4" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <div className="p-3 border-b border-border">
          <p className="text-sm font-semibold">Reminders</p>
        </div>
        {reminders.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No reminders right now 🎉
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            {reminders.map((r) => (
              <div
                key={r.id}
                className="flex items-start gap-2 px-3 py-2.5 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
              >
                <div className="mt-0.5">{getReminderIcon(r.type)}</div>
                <p className="text-xs text-foreground flex-1 leading-relaxed">{r.message}</p>
                <button
                  onClick={() => onDismiss(r.id)}
                  className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
