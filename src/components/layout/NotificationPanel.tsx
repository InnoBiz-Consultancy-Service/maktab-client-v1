"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Bell, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { NotificationItem } from "./NotificationItem";
import { markNotificationReadAction } from "@/actions/attendance/mark-notification-read";
import type { AttendanceNotification } from "@/types/attendance";
import { getNotificationsAction } from "@/actions/attendance/get-notification";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  role: string;
}

export function NotificationPanel({
  open,
  onClose,
  role,
}: NotificationPanelProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AttendanceNotification[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const res = await getNotificationsAction();
    if (res.ok) setNotifications(res.data);
    setLoading(false);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (open && !loaded) {
      fetchNotifications();
    }
  }, [open, loaded, fetchNotifications]);

  async function handleTap(notification: AttendanceNotification) {
    // Mark as read
    if (!notification.isRead) {
      const res = await markNotificationReadAction(notification.id);
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n,
          ),
        );
      }
    }

    // Navigate to the relevant batch
    const batchId = notification.payload?.batch?.batchId;
    if (batchId) {
      const basePath =
        role === "INSTITUTE"
          ? "/dashboard/institute/attendance/batches"
          : "/dashboard/teacher/attendance";
      if (role === "INSTITUTE") {
        router.push(`${basePath}/${batchId}`);
      } else {
        router.push(basePath);
      }
    }
    onClose();
  }

  if (!open) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-night-900/40"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        className={cn(
          "relative h-full w-full max-w-md overflow-hidden bg-cream-50 shadow-lift",
          "sm:mt-2 sm:mr-4 sm:h-[min(85vh,640px)] sm:rounded-2xl",
        )}
        role="dialog"
        aria-label="Notifications"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-200 px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-night-900">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1.5 text-xs font-bold text-cream-50">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream-200"
          >
            <X className="h-5 w-5" aria-hidden />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* List */}
        <div className="h-[calc(100%-56px)] overflow-y-auto overscroll-contain">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-ink-soft" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <Bell className="h-10 w-10 text-cream-200" aria-hidden />
              <p className="text-sm text-ink-soft">No notifications yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-cream-200">
              {notifications.map((n) => (
                <li key={n.id}>
                  <NotificationItem notification={n} onTap={handleTap} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
