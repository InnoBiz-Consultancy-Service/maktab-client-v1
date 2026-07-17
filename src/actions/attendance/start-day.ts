"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type { AttendanceDay, StartDayInput } from "@/types/attendance";

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

/**
 * Open a new attendance day for a batch.
 * Double-tap safe: if the same teacher calls again, the existing day is returned.
 * 409 if another teacher already started, or if today is marked as holiday.
 */
export async function startDayAction(
  input: StartDayInput,
): Promise<ActionResult<AttendanceDay>> {
  const result = await universalApi<unknown>({
    endpoint: "/attendance/days",
    method: "POST",
    data: input,
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not start attendance.",
    };
  }

  return { ok: true, data: unwrap<AttendanceDay>(result.data) };
}
