"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type {
  ParentChildOverviewItem,
  ParentChildDetailData,
} from "@/types/dashboard";

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
 * 6.1 GET /parents/dashboard/children
 * Returns array of all the parent's active children with progress, points, and rank.
 */
export async function getParentChildrenDashboardAction(): Promise<
  ActionResult<ParentChildOverviewItem[]>
> {
  const result = await universalApi<unknown>({
    endpoint: "/parents/dashboard/children",
    method: "GET",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load children dashboard data.",
    };
  }

  return { ok: true, data: unwrap<ParentChildOverviewItem[]>(result.data) };
}

/**
 * 6.2 GET /parents/dashboard/children/:studentId
 * Returns full detail for one child of the parent.
 */
export async function getParentChildDetailDashboardAction(
  studentId: string,
): Promise<ActionResult<ParentChildDetailData>> {
  const result = await universalApi<unknown>({
    endpoint: `/parents/dashboard/children/${studentId}`,
    method: "GET",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load child detail.",
    };
  }

  return { ok: true, data: unwrap<ParentChildDetailData>(result.data) };
}
