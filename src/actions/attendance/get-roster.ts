"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type { RosterResponse } from "@/types/attendance";

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
 * Fetch the roster for an attendance day — every student with their current
 * status. Any batch-teacher can view; only the owner can edit.
 */
export async function getRosterAction(
  dayId: string,
): Promise<ActionResult<RosterResponse>> {
  const result = await universalApi<unknown>({
    endpoint: `/attendance/days/${dayId}/roster`,
    method: "GET",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load roster.",
    };
  }

  return { ok: true, data: unwrap<RosterResponse>(result.data) };
}
