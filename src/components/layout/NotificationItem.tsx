"use client";

import { cn } from "@/lib/utils/cn";
import { Bell, CheckCircle2 } from "lucide-react";
import type { AttendanceNotification } from "@/types/attendance";

interface NotificationItemProps {
  notification: AttendanceNotification;
  onTap: (notification: AttendanceNotification) => void;
}

export function NotificationItem({
  notification,
  onTap,
}: NotificationItemProps) {
  const isResolved = notification.resolvedAt !== null;
  const isRead = notification.isRead;

  /** e.g. "2 hours ago", "yesterday" */
  function timeAgo(dateStr: string): string {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = Math.max(0, now - then);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return "yesterday";
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  }

  return (
    <button
      type="button"
      onClick={() => onTap(notification)}
      className={cn(
        "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors active:bg-cream-200 sm:px-5",
        !isRead ? "bg-gold-500/5" : "hover:bg-cream-100",
      )}
    >
      {/* Icon */}
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          isResolved ? "bg-success/10" : "bg-error/10",
        )}
      >
        {isResolved ? (
          <CheckCircle2 className="h-4 w-4 text-success" aria-hidden />
        ) : (
          <Bell className="h-4 w-4 text-error" aria-hidden />
        )}
      </span>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm leading-snug",
              !isRead
                ? "font-semibold text-night-900"
                : "font-medium text-night-900",
            )}
          >
            {notification.title}
          </p>
          {!isRead && (
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold-500"
              aria-label="Unread"
            />
          )}
        </div>

        <p className="mt-0.5 text-sm leading-snug text-ink-soft">
          {notification.message}
        </p>

        <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-soft">
          <span>{timeAgo(notification.createdAt)}</span>
          {isResolved && (
            <>
              <span className="text-cream-200">·</span>
              <span className="text-success">Taken late</span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}
