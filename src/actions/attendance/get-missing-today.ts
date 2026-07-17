"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type { MissingToday } from "@/types/attendance";

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

export async function getMissingTodayAction(): Promise<
  ActionResult<MissingToday>
> {
  const result = await universalApi<unknown>({
    endpoint: "/attendance/institute/missing-today",
    method: "GET",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load missing attendance.",
    };
  }

  return {
    ok: true,
    data: unwrap<MissingToday>(result.data),
  };
}
