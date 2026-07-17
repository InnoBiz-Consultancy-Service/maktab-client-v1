"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type { AttendanceNotification } from "@/types/attendance";

function unwrap<T>(raw: unknown): T {
  if (
    raw &&
    typeof raw === "object" &&
    "data" in raw &&
    (raw as { data?: unknown }).data !== undefined
  ) {
    return (raw as { data: T }).data;
  }
  return raw as T;
}

/** Mark a single notification as read. */
export async function markNotificationReadAction(
  notificationId: string,
): Promise<ActionResult<AttendanceNotification>> {
  const result = await universalApi<unknown>({
    endpoint: `/notifications/${notificationId}/read`,
    method: "PATCH",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not mark notification as read.",
    };
  }

  return { ok: true, data: unwrap<AttendanceNotification>(result.data) };
}
