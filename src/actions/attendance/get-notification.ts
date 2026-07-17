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

/** Fetch the current user's notifications (newest first, max 50). */
export async function getNotificationsAction(): Promise<
  ActionResult<AttendanceNotification[]>
> {
  const result = await universalApi<unknown>({
    endpoint: "/notifications",
    method: "GET",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load notifications.",
    };
  }

  return {
    ok: true,
    data: unwrap<AttendanceNotification[]>(result.data),
  };
}
