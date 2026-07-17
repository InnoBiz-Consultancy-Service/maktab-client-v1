"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type { InstituteOverview } from "@/types/attendance";

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
 * Fetch the institute-wide attendance overview.
 * Optional: `from`, `to`, `below` (default 75).
 */
export async function getInstituteOverviewAction(params?: {
  from?: string;
  to?: string;
  below?: number;
}): Promise<ActionResult<InstituteOverview>> {
  const query = new URLSearchParams();
  if (params?.from) query.set("from", params.from);
  if (params?.to) query.set("to", params.to);
  if (params?.below !== undefined) query.set("below", String(params.below));

  const qs = query.toString();
  const endpoint = `/attendance/institute/overview${qs ? `?${qs}` : ""}`;

  const result = await universalApi<unknown>({ endpoint, method: "GET" });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load institute overview.",
    };
  }

  return { ok: true, data: unwrap<InstituteOverview>(result.data) };
}
