"use server";

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

/**
 * GET /batches/:id — one batch with its teachers and students.
 * A batch belonging to another institute comes back as a 403 from the API;
 * one that doesn't exist comes back as a 404. Both surface as `error` here.
 */
export async function getBatchAction(id: string): Promise<ActionResult<Batch>> {
  const result = await universalApi<unknown>({
    endpoint: `/batches/${id}`,
    method: "GET",
    requireAuth: true,
  });

  if (!result.success) {
    return { ok: false, error: result.message ?? "Could not load this batch." };
  }

  return { ok: true, data: unwrap<Batch>(result.data) };
}
