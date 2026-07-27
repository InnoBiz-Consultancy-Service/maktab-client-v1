"use server";

import { universalApi } from "@/actions/universal-api";
import { unwrapList } from "@/lib/utils/unwrap";
import type { ActionResult } from "@/types/shared";
import type { Batch } from "@/types/institute/batch";

export async function getMyBatchesAction(
  search = "",
): Promise<ActionResult<Batch[]>> {
  const query = search.trim();
  const endpoint = query
    ? `/teachers/my-batches?search=${encodeURIComponent(query)}`
    : "/teachers/my-batches";

  try {
    const res = await universalApi<any>({ endpoint, method: "GET" });
    if (!res.success) {
      return {
        ok: false,
        error: res.message ?? "Could not load your batches.",
      };
    }
    return { ok: true, data: unwrapList<Batch>(res.data) };
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message ?? "Could not load your batches.",
    };
  }
}
