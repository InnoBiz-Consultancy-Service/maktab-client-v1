"use server";

import { universalApi } from "@/actions/universal-api";
import { StudentSearchResult } from "@/types/institute/student";
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
