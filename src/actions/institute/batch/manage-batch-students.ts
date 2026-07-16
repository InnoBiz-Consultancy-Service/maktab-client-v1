"use server";

import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import { batchStudentIdsSchema } from "@/lib/utils/validation";
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

function revalidateBatch(id: string) {
  revalidatePath("/dashboard/institute/batches");
  revalidatePath(`/dashboard/institute/batches/${id}`);
}

/** POST /batches/:id/students — adds students, keeping the ones already there. */
export async function addBatchStudentsAction(
  batchId: string,
  studentIds: string[],
): Promise<ActionResult<Batch>> {
  const parsed = batchStudentIdsSchema.safeParse({ studentIds });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Select at least one student.",
    };
  }

  const result = await universalApi<unknown>({
    endpoint: `/batches/${batchId}/students`,
    method: "POST",
    data: parsed.data,
    requireAuth: true,
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not add the student(s).",
    };
  }

  revalidateBatch(batchId);
  return { ok: true, data: unwrap<Batch>(result.data) };
}

/** DELETE /batches/:id/students — removes students from the batch only (no deletion). */
export async function removeBatchStudentsAction(
  batchId: string,
  studentIds: string[],
): Promise<ActionResult<Batch>> {
  const parsed = batchStudentIdsSchema.safeParse({ studentIds });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Select at least one student.",
    };
  }

  const result = await universalApi<unknown>({
    endpoint: `/batches/${batchId}/students`,
    method: "DELETE",
    data: parsed.data,
    requireAuth: true,
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not remove the student(s).",
    };
  }

  revalidateBatch(batchId);
  return { ok: true, data: unwrap<Batch>(result.data) };
}
