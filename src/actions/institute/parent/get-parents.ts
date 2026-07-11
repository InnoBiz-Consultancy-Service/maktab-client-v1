"use server";

import { universalApi } from "@/actions/universal-api";
import { ParentSearchResult } from "@/types/institute/parents";
import type { ActionResult } from "@/types/shared";

function unwrapList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (
    raw &&
    typeof raw === "object" &&
    "data" in raw &&
    Array.isArray((raw as { data?: unknown }).data)
  ) {
    return (raw as { data: T[] }).data;
  }
  return [];
}

export async function searchParentsAction(
  term: string,
): Promise<ActionResult<ParentSearchResult[]>> {
  const query = term.trim();
  const endpoint = query
    ? `/parents?search=${encodeURIComponent(query)}`
    : "/parents";

  const result = await universalApi<unknown>({
    endpoint,
    method: "GET",
    requireAuth: true,
  });

  if (!result.success) {
    return { ok: false, error: result.message ?? "Could not load parents." };
  }

  return { ok: true, data: unwrapList<ParentSearchResult>(result.data) };
}
