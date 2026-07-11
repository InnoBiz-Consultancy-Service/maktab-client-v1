"use server";

import { universalApi } from "@/actions/universal-api";
import { TeacherSearchResult } from "@/types/institute/teachers";
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
