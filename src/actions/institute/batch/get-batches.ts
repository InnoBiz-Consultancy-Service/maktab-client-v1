"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type { Batch } from "@/types/institute/batch";

function unwrapList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (
    raw &&
    typeof raw === "object" &&
    "data" in raw &&
    Array.isArray((raw as { data?: unknown }).data)
  ) {
    return (raw as { data: T[] }).data;
  }
  return [];
}

/** GET /batches?search= — the institute's own batches, newest first. */
export async function getBatchesAction(
  search = "",
): Promise<ActionResult<Batch[]>> {
  const query = search.trim();
  const endpoint = query
    ? `/batches?search=${encodeURIComponent(query)}`
    : "/batches";

  const result = await universalApi<unknown>({
    endpoint,
    method: "GET",
    requireAuth: true,
  });

  if (!result.success) {
    return { ok: false, error: result.message ?? "Could not load batches." };
  }

  return { ok: true, data: unwrapList<Batch>(result.data) };
}
