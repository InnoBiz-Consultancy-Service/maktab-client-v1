"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type { StudentHistoryEntry } from "@/types/attendance";

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
 * Fetch date-wise attendance history for a student.
 * Optional filters: `from`, `to`, `status` (ABSENT / PRESENT / LATE).
 */
export async function getStudentHistoryAction(
  studentId: string,
  params?: { from?: string; to?: string; status?: string },
): Promise<ActionResult<StudentHistoryEntry[]>> {
  const query = new URLSearchParams();
  if (params?.from) query.set("from", params.from);
  if (params?.to) query.set("to", params.to);
  if (params?.status) query.set("status", params.status);

  const qs = query.toString();
  const endpoint = `/attendance/students/${studentId}/history${qs ? `?${qs}` : ""}`;

  const result = await universalApi<unknown>({ endpoint, method: "GET" });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load history.",
    };
  }

  return { ok: true, data: unwrap<StudentHistoryEntry[]>(result.data) };
}
