"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type { TodayResponse } from "@/types/attendance";

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

/** Fetch today's attendance state for every batch the teacher is assigned to. */
export async function getTodayAction(): Promise<ActionResult<TodayResponse>> {
  const result = await universalApi<unknown>({
    endpoint: "/attendance/today",
    method: "GET",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load today's attendance.",
    };
  }

  return { ok: true, data: unwrap<TodayResponse>(result.data) };
}
