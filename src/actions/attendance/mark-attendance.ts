"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type { MarkInput, RosterResponse } from "@/types/attendance";

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
 * Save attendance records for every student in the batch.
 * `finalize: false` saves as draft; `true` locks the day.
 * Must include ALL students. Response is the full roster with recordIds.
 */
export async function markAttendanceAction(
  dayId: string,
  input: MarkInput,
): Promise<ActionResult<RosterResponse>> {
  const result = await universalApi<unknown>({
    endpoint: `/attendance/days/${dayId}/mark`,
    method: "POST",
    data: input,
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not save attendance.",
    };
  }

  return { ok: true, data: unwrap<RosterResponse>(result.data) };
}
