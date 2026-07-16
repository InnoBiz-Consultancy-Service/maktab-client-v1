"use server";

import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type { Batch } from "@/types/institute/batch";

function unwrap<T>(raw: unknown): T {
  if (
    raw &&
    typeof raw === "object" &&
    "data" in raw &&
    (raw as { data?: unknown }).data &&
    typeof (raw as { data?: unknown }).data === "object"
  ) {
    return (raw as { data: T }).data;
  }
  return raw as T;
}

/** PATCH /batches/:id/toggle-status — flips active ⇄ inactive. */
export async function toggleBatchStatusAction(
  id: string,
): Promise<ActionResult<Batch>> {
  const result = await universalApi<unknown>({
    endpoint: `/batches/${id}/toggle-status`,
    method: "PATCH",
    requireAuth: true,
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not change the batch status.",
    };
  }

  revalidatePath("/dashboard/institute/batches");
  revalidatePath(`/dashboard/institute/batches/${id}`);
  return { ok: true, data: unwrap<Batch>(result.data) };
}
