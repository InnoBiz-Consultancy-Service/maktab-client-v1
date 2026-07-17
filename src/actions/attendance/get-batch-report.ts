"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type { BatchReport } from "@/types/attendance";

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
 * Fetch the attendance report for a batch — every student with their stats.
 * Optional: `from`, `to`, `below` (threshold %).
 */
export async function getBatchReportAction(
  batchId: string,
  params?: { from?: string; to?: string; below?: number },
): Promise<ActionResult<BatchReport>> {
  const query = new URLSearchParams();
  if (params?.from) query.set("from", params.from);
  if (params?.to) query.set("to", params.to);
  if (params?.below !== undefined) query.set("below", String(params.below));

  const qs = query.toString();
  const endpoint = `/attendance/batches/${batchId}/report${qs ? `?${qs}` : ""}`;

  const result = await universalApi<unknown>({ endpoint, method: "GET" });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load batch report.",
    };
  }

  return { ok: true, data: unwrap<BatchReport>(result.data) };
}