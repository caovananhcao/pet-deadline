import { useEffect, useRef, useCallback } from "react";
import { Task } from "@/types/task";
import { useLocalStorage } from "./useLocalStorage";

export interface TaskReminder {
  id: string;
  taskId: string;
  taskTitle: string;
  type: "due-today" | "due-soon" | "overdue";
  message: string;
  createdAt: string;
  read: boolean;
}

function getActiveReminders(tasks: Task[], dismissed: string[]): TaskReminder[] {
  const now = new Date();
  const reminders: TaskReminder[] = [];

  for (const task of tasks) {
    if (task.completed) continue;

    const deadline = new Date(task.deadline);
    const diffMs = deadline.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const todayDate = new Date(now);
    todayDate.setHours(0, 0, 0, 0);
    const diffDays = (deadlineDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffMs < 0) {
      const rid = `overdue-${task.id}`;
      if (!dismissed.includes(rid)) {
        reminders.push({
          id: rid,
          taskId: task.id,
          taskTitle: task.title,
          type: "overdue",
          message: `"${task.title}" is overdue! Your pet is sleeping 😴`,
          createdAt: now.toISOString(),
          read: false,
        });
      }
    } else if (diffHours <= 1 && diffHours > 0) {
      const rid = `due-soon-${task.id}`;
      if (!dismissed.includes(rid)) {
        reminders.push({
          id: rid,
          taskId: task.id,
          taskTitle: task.title,
          type: "due-soon",
          message: `"${task.title}" is due in less than 1 hour! 🚨`,
          createdAt: now.toISOString(),
          read: false,
        });
      }
    } else if (diffDays === 0) {
      const rid = `due-today-${task.id}`;
      if (!dismissed.includes(rid)) {
        reminders.push({
          id: rid,
          taskId: task.id,
          taskTitle: task.title,
          type: "due-today",
          message: `"${task.title}" is due today! Take care of your pet 🐾`,
          createdAt: now.toISOString(),
          read: false,
        });
      }
    }
  }

  return reminders;
}

export function useTaskNotifications(tasks: Task[]) {
  const [dismissed, setDismissed] = useLocalStorage<string[]>("deadline-pets-dismissed-reminders", []);
  const [readIds, setReadIds] = useLocalStorage<string[]>("deadline-pets-read-reminders", []);
  const notifiedRef = useRef<Set<string>>(new Set());

  const reminders = getActiveReminders(tasks, dismissed);
  const unreadCount = reminders.filter((r) => !readIds.includes(r.id)).length;

  const dismissReminder = useCallback(
    (reminderId: string) => {
      setDismissed((prev) => [...prev, reminderId]);
    },
    [setDismissed]
  );

  const markAllRead = useCallback(() => {
    setReadIds((prev) => [
      ...prev,
      ...reminders.map((r) => r.id).filter((id) => !prev.includes(id)),
    ]);
  }, [reminders, setReadIds]);

  // Browser notifications
  useEffect(() => {
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") return;

    for (const reminder of reminders) {
      if (notifiedRef.current.has(reminder.id)) continue;
      notifiedRef.current.add(reminder.id);

      new Notification("Deadline Pets 🐾", {
        body: reminder.message.replace(/["""]/g, ""),
        icon: "/icon-512.png",
        tag: reminder.id,
      });
    }
  }, [reminders]);

  // Periodic refresh (re-evaluate every 60s via state change)
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to recalculate reminders
      setDismissed((prev) => [...prev]);
    }, 60_000);
    return () => clearInterval(interval);
  }, [setDismissed]);

  return { reminders, unreadCount, dismissReminder, markAllRead };
}

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof Notification === "undefined") return Promise.resolve("denied" as NotificationPermission);
  return Notification.requestPermission();
}
