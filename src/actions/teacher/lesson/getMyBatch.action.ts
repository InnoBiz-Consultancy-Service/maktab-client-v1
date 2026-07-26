"use server";

import { universalApi } from "@/actions/universal-api";
import { unwrapList } from "@/lib/utils/unwrap";
import type { ActionResult } from "@/types/shared";
import type { Batch } from "@/types/institute/batch";

/** GET /teachers/my-batches?search= */
export async function getMyBatchesAction(
  search = "",
): Promise<ActionResult<Batch[]>> {
  const query = search.trim();

  const endpoint = query
    ? `/teachers/my-batches?search=${encodeURIComponent(query)}`
    : "/teachers/my-batches";

  const result = await universalApi<unknown>({
    endpoint,
    method: "GET",
    requireAuth: true,
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load teacher batches.",
    };
  }

  return {
    ok: true,
    data: unwrapList<Batch>(result.data),
  };
}