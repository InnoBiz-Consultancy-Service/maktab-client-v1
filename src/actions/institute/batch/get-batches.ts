"use server";

import { universalApi } from "@/actions/universal-api";
import { unwrapList } from "@/lib/utils/unwrap";
import type { ActionResult } from "@/types/shared";
import type { Batch } from "@/types/institute/batch";

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
