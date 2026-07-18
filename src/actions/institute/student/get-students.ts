"use server";

import { universalApi } from "@/actions/universal-api";
import { unwrapList } from "@/lib/utils/unwrap";
import { StudentSearchResult } from "@/types/institute/student";
import type { ActionResult } from "@/types/shared";

/** GET /students?search= — name, studentCode, or class. */
export async function searchStudentsAction(
  term: string,
): Promise<ActionResult<StudentSearchResult[]>> {
  const query = term.trim();
  const endpoint = query
    ? `/students?search=${encodeURIComponent(query)}`
    : "/students";

  const result = await universalApi<unknown>({
    endpoint,
    method: "GET",
    requireAuth: true,
  });

  if (!result.success) {
    return { ok: false, error: result.message ?? "Could not load students." };
  }

  return { ok: true, data: unwrapList<StudentSearchResult>(result.data) };
}
