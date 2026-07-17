"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type { EditRecordInput, EditRecordResponse } from "@/types/attendance";

function unwrap<T>(raw: unknown): T {
  if (
    raw &&
    typeof raw === "object" &&
    "data" in raw &&
    (raw as { data?: unknown }).data !== undefined
  ) {
    return (raw as { data: T }).data;
  }
  return raw as T;
}

/**
 * Change one student's status after the day has been finalized.
 * Only the day owner can do this. Every change is audit-logged.
 */
export async function editRecordAction(
  recordId: string,
  input: EditRecordInput,
): Promise<ActionResult<EditRecordResponse>> {
  const result = await universalApi<unknown>({
    endpoint: `/attendance/records/${recordId}`,
    method: "PATCH",
    data: input,
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not update record.",
    };
  }

  return { ok: true, data: unwrap<EditRecordResponse>(result.data) };
}
