import { Bell, X } from "lucide-react";
import { TaskReminder, requestNotificationPermission } from "@/hooks/useTaskNotifications";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ReminderBannerProps {
  reminders: TaskReminder[];
  onDismiss: (id: string) => void;
}

export function ReminderBanner({ reminders, onDismiss }: ReminderBannerProps) {
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );
  const [permDismissed, setPermDismissed] = useState(false);

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    const perm = await requestNotificationPermission();
    setNotifPermission(perm);
    if (perm === "granted") {
      toast.success("Browser notifications enabled! 🔔");
    } else {
      toast.info("Notifications blocked. You can change this in browser settings.");
    }
  };

  const urgentReminder = reminders.find((r) => r.type === "due-soon" || r.type === "overdue");
  const showPermBanner = notifPermission === "default" && !permDismissed && typeof Notification !== "undefined";

  return (
    <div className="space-y-2 mb-4">
      {showPermBanner && (
        <div className="flex items-center gap-3 bg-secondary/50 border border-border rounded-lg px-4 py-3">
          <Bell className="w-4 h-4 text-secondary-foreground shrink-0" />
          <p className="text-xs text-secondary-foreground flex-1">
            Enable notifications to get reminded about deadlines
          </p>
          <Button size="sm" variant="secondary" className="rounded-lg text-xs h-7" onClick={handleRequestPermission}>
            Enable
          </Button>
          <button onClick={() => setPermDismissed(true)} className="text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {urgentReminder && (
        <div className="flex items-center gap-3 bg-pale-yellow border border-border rounded-lg px-4 py-3">
          <span className="text-base">⚠️</span>
          <p className="text-xs text-foreground flex-1">{urgentReminder.message}</p>
          <button
            onClick={() => onDismiss(urgentReminder.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
