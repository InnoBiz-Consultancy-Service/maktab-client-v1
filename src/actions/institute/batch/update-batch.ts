"use server";

import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import { updateBatchSchema } from "@/lib/utils/validation";
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

export interface UpdateBatchPayload {
  name: string;
}

/** PATCH /batches/:id — rename a batch. */
export async function updateBatchAction(
  id: string,
  payload: UpdateBatchPayload,
): Promise<ActionResult<Batch>> {
  const parsed = updateBatchSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Please check the name.",
    };
  }

  const result = await universalApi<unknown>({
    endpoint: `/batches/${id}`,
    method: "PATCH",
    data: parsed.data,
    requireAuth: true,
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not update the batch.",
    };
  }

  revalidatePath("/dashboard/institute/batches");
  revalidatePath(`/dashboard/institute/batches/${id}`);
  return { ok: true, data: unwrap<Batch>(result.data) };
}
