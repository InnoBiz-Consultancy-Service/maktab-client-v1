"use server";

import { universalApi } from "@/actions/universal-api";
import { unwrapList } from "@/lib/utils/unwrap";
import { ParentSearchResult } from "@/types/institute/parents";
import type { ActionResult } from "@/types/shared";

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
