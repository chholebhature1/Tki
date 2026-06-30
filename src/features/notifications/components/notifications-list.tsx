"use client";

import { useRouter } from "next/navigation";
import { Bell, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NotificationRecord } from "../repositories";
import { markNotificationReadAction, markAllNotificationsReadAction, deleteNotificationAction, deleteAllNotificationsAction } from "../actions";

interface NotificationsListProps {
  notifications: NotificationRecord[];
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  const router = useRouter();

  async function handleMarkRead(id: string) {
    await markNotificationReadAction(id);
    router.refresh();
  }

  async function handleMarkAll() {
    await markAllNotificationsReadAction();
    router.refresh();
  }

  async function handleDelete(id: string) {
    await deleteNotificationAction(id);
    router.refresh();
  }

  async function handleDeleteAll() {
    if (!confirm("Delete all notifications?")) return;
    await deleteAllNotificationsAction();
    router.refresh();
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-white p-12 text-center">
        <Bell className="mx-auto h-10 w-10 text-muted" aria-hidden="true" />
        <h2 className="mt-4 text-base font-semibold text-text">No notifications</h2>
        <p className="mt-1 text-sm text-text-secondary">You&apos;re all caught up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">{notifications.filter((n) => !n.is_read).length} unread</p>
        <div className="flex gap-2">
          <button onClick={handleMarkAll} className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/5">Mark all read</button>
          <button onClick={handleDeleteAll} className="rounded-lg px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/5">Clear all</button>
        </div>
      </div>

      <div className="space-y-2">
        {notifications.map((n) => (
          <div key={n.id} className={cn("flex items-start gap-3 rounded-xl border p-4 transition-colors", n.is_read ? "border-border bg-white" : "border-primary/20 bg-primary-light/30")}>
            <div className={cn("mt-0.5 h-2 w-2 shrink-0 rounded-full", n.is_read ? "bg-transparent" : "bg-primary")} aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text">{n.title}</p>
              <p className="mt-0.5 text-xs text-text-secondary">{n.message}</p>
              <p className="mt-1 text-[10px] text-muted">{new Date(n.created_at).toLocaleString("en-IN")}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              {!n.is_read && (
                <button onClick={() => handleMarkRead(n.id)} className="rounded p-1 text-muted hover:text-primary" aria-label="Mark as read">
                  <Check className="h-3.5 w-3.5" />
                </button>
              )}
              <button onClick={() => handleDelete(n.id)} className="rounded p-1 text-muted hover:text-danger" aria-label="Delete">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
