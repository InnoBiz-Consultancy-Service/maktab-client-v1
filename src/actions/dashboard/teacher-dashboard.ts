"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type {
  TeacherOverviewData,
  StudentQueryParams,
  PaginatedData,
  DashboardStudentItem,
  StudentDetailData,
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
 * 5.1 GET /teachers/dashboard/overview
 * Scoped to teacher's own batches: counts + progress rates.
 */
export async function getTeacherDashboardOverviewAction(): Promise<
  ActionResult<TeacherOverviewData>
> {
  const result = await universalApi<unknown>({
    endpoint: "/teachers/dashboard/overview",
    method: "GET",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load teacher dashboard overview.",
    };
  }

  return { ok: true, data: unwrap<TeacherOverviewData>(result.data) };
}

/**
 * 5.2 GET /teachers/dashboard/students
 * Scoped to teacher's own students: pagination, filter, search, sort.
 */
export async function getTeacherDashboardStudentsAction(
  params?: StudentQueryParams,
): Promise<ActionResult<PaginatedData<DashboardStudentItem>>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);
  if (params?.batchId) query.set("batchId", params.batchId);
  if (params?.class) query.set("class", params.class);
  if (params?.isActive !== undefined)
    query.set("isActive", String(params.isActive));
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);

  const qs = query.toString();
  const endpoint = `/teachers/dashboard/students${qs ? `?${qs}` : ""}`;

  const result = await universalApi<unknown>({
    endpoint,
    method: "GET",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load teacher students.",
    };
  }

  return {
    ok: true,
    data: unwrap<PaginatedData<DashboardStudentItem>>(result.data),
  };
}

/**
 * 5.3 GET /teachers/dashboard/students/:studentId
 * Detailed student breakdown for a student in teacher's batch.
 */
export async function getTeacherStudentDetailAction(
  studentId: string,
): Promise<ActionResult<StudentDetailData>> {
  const result = await universalApi<unknown>({
    endpoint: `/teachers/dashboard/students/${studentId}`,
    method: "GET",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load student detail.",
    };
  }

  return { ok: true, data: unwrap<StudentDetailData>(result.data) };
}
