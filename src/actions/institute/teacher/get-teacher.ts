"use server";

import { universalApi } from "@/actions/universal-api";
import { unwrapList } from "@/lib/utils/unwrap";
import { TeacherSearchResult } from "@/types/institute/teachers";
import type { ActionResult } from "@/types/shared";

export async function searchTeachersAction(
  term: string,
): Promise<ActionResult<TeacherSearchResult[]>> {
  const query = term.trim();
  const endpoint = query
    ? `/teachers?search=${encodeURIComponent(query)}`
    : "/teachers";

  const result = await universalApi<unknown>({
    endpoint,
    method: "GET",
    requireAuth: true,
  });

  if (!result.success) {
    return { ok: false, error: result.message ?? "Could not load teachers." };
  }

  return { ok: true, data: unwrapList<TeacherSearchResult>(result.data) };
}
