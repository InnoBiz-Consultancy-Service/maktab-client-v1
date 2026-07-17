"use server";

import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import { createBatchSchema } from "@/lib/utils/validation";
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

/** What the create-batch form sends up. Teachers/students are optional. */
export interface CreateBatchPayload {
  name: string;
  teacherIds?: string[];
  studentIds?: string[];
}

/**
 * Create a batch (class). `teacherIds`/`studentIds` are optional — when
 * present, at least one id is required (enforced by the schema).
 * `instituteId` is never sent — the backend derives it from the token.
 */
export async function createBatchAction(
  payload: CreateBatchPayload,
): Promise<ActionResult<Batch>> {
  const parsed = createBatchSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Please check the form.",
    };
  }

  const body: Record<string, unknown> = { name: parsed.data.name };
  if (parsed.data.teacherIds?.length) body.teacherIds = parsed.data.teacherIds;
  if (parsed.data.studentIds?.length) body.studentIds = parsed.data.studentIds;

  const result = await universalApi<unknown>({
    endpoint: "/batches",
    method: "POST",
    data: body,
    requireAuth: true,
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not create the batch.",
    };
  }

  revalidatePath("/dashboard/institute/batches");
  return { ok: true, data: unwrap<Batch>(result.data) };
}
