"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type { MyChild } from "@/types/attendance";

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
 * Fetch all children linked to the logged-in parent.
 * Note: `data` is an array here (unlike most endpoints where it's an object).
 */
export async function getMyChildrenAction(): Promise<ActionResult<MyChild[]>> {
  const result = await universalApi<unknown>({
    endpoint: "/parents/my-children",
    method: "GET",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load children.",
    };
  }

  return {
    ok: true,
    data: unwrap<MyChild[]>(result.data),
  };
}
