"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { NotificationPanel } from "./NotificationPanel";
import { getNotificationsAction } from "@/actions/attendance/get-notification";

interface NotificationBellProps {
  role: string;
  className?: string;
}

export function NotificationBell({ role, className }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    const res = await getNotificationsAction();
    if (res.ok) {
      setUnreadCount(res.data.filter((n) => !n.isRead).length);
    }
  }, []);

  useEffect(() => {
    // Only teachers and institute users get notifications
    if (role !== "TEACHER" && role !== "INSTITUTE") return;
    fetchUnreadCount();
    // Poll every 60 seconds
    const interval = setInterval(fetchUnreadCount, 60_000);
    return () => clearInterval(interval);
  }, [role, fetchUnreadCount]);

  // Don't render for parents/students
  if (role !== "TEACHER" && role !== "INSTITUTE") return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream-200 active:scale-95",
          className,
        )}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
      >
        <Bell className="h-5 w-5" aria-hidden />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold leading-none text-cream-50">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <NotificationPanel
        open={open}
        onClose={() => {
          setOpen(false);
          // Refresh count after closing
          fetchUnreadCount();
        }}
        role={role}
      />
    </>
  );
}
