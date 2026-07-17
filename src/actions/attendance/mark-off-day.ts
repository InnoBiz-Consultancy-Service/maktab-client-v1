"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type { OffDayInput, OffDayResponse } from "@/types/attendance";

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
 * Mark one or more days as off-day (holiday) for a batch.
 * Days where attendance is already taken are skipped (not overwritten).
 * Max 90 days in a single call.
 */
export async function markOffDayAction(
  input: OffDayInput,
): Promise<ActionResult<OffDayResponse>> {
  const result = await universalApi<unknown>({
    endpoint: "/attendance/off-days",
    method: "POST",
    data: input,
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not mark off-day.",
    };
  }

  return { ok: true, data: unwrap<OffDayResponse>(result.data) };
}
