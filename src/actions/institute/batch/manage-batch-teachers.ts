"use server";

import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import { batchTeacherIdsSchema } from "@/lib/utils/validation";
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

/** POST /batches/:id/teachers — adds teachers, keeping the ones already there. */
export async function addBatchTeachersAction(
  batchId: string,
  teacherIds: string[],
): Promise<ActionResult<Batch>> {
  const parsed = batchTeacherIdsSchema.safeParse({ teacherIds });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Select at least one teacher.",
    };
  }

  const result = await universalApi<unknown>({
    endpoint: `/batches/${batchId}/teachers`,
    method: "PATCH",
    data: parsed.data,
    requireAuth: true,
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not add the teacher(s).",
    };
  }

  revalidateBatch(batchId);
  return { ok: true, data: unwrap<Batch>(result.data) };
}

/** DELETE /batches/:id/teachers — removes teachers from the batch only (no deletion). */
export async function removeBatchTeachersAction(
  batchId: string,
  teacherIds: string[],
): Promise<ActionResult<Batch>> {
  const parsed = batchTeacherIdsSchema.safeParse({ teacherIds });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Select at least one teacher.",
    };
  }

  const result = await universalApi<unknown>({
    endpoint: `/batches/${batchId}/teachers`,
    method: "DELETE",
    data: parsed.data,
    requireAuth: true,
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not remove the teacher(s).",
    };
  }

  revalidateBatch(batchId);
  return { ok: true, data: unwrap<Batch>(result.data) };
}
