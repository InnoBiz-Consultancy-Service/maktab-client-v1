"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type { StudentSummary } from "@/types/attendance";

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
 * Fetch a student's attendance summary for a date range.
 * - No query params → current month
 * - `from` + `to` → custom range
 * - `preset=all` → from first attendance to today
 */
export async function getStudentSummaryAction(
  studentId: string,
  params?: { from?: string; to?: string; preset?: "all" },
): Promise<ActionResult<StudentSummary>> {
  const query = new URLSearchParams();
  if (params?.preset) query.set("preset", params.preset);
  if (params?.from) query.set("from", params.from);
  if (params?.to) query.set("to", params.to);

  const qs = query.toString();
  const endpoint = `/attendance/students/${studentId}/summary${qs ? `?${qs}` : ""}`;

  const result = await universalApi<unknown>({ endpoint, method: "GET" });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load summary.",
    };
  }

  return { ok: true, data: unwrap<StudentSummary>(result.data) };
}
