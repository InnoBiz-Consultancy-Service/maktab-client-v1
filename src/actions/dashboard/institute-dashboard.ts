"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import type {
  InstituteOverviewData,
  InstituteBatchItem,
  StudentQueryParams,
  PaginatedData,
  DashboardStudentItem,
  StudentDetailData,
  DashboardTeacherItem,
  TeacherDetailData,
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
 * 4.1 GET /institutes/dashboard/overview
 * Institution-wide counts + progress rates.
 */
export async function getInstituteDashboardOverviewAction(): Promise<
  ActionResult<InstituteOverviewData>
> {
  const result = await universalApi<unknown>({
    endpoint: "/institutes/dashboard/overview",
    method: "GET",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load institute overview.",
    };
  }

  return { ok: true, data: unwrap<InstituteOverviewData>(result.data) };
}

/**
 * 4.2 GET /institutes/dashboard/batches
 * Array of batch progress objects (including completed batches).
 */
export async function getInstituteDashboardBatchesAction(): Promise<
  ActionResult<InstituteBatchItem[]>
> {
  const result = await universalApi<unknown>({
    endpoint: "/institutes/dashboard/batches",
    method: "GET",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load institute batches.",
    };
  }

  return { ok: true, data: unwrap<InstituteBatchItem[]>(result.data) };
}

/**
 * 4.3 GET /institutes/dashboard/students
 * Paginated student list with search, filtering, and sorting.
 */
export async function getInstituteDashboardStudentsAction(
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
  const endpoint = `/institutes/dashboard/students${qs ? `?${qs}` : ""}`;

  const result = await universalApi<unknown>({
    endpoint,
    method: "GET",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load students.",
    };
  }

  return {
    ok: true,
    data: unwrap<PaginatedData<DashboardStudentItem>>(result.data),
  };
}

/**
 * 4.4 GET /institutes/dashboard/students/:studentId
 * Full profile + breakdown + record lists.
 */
export async function getInstituteStudentDetailAction(
  studentId: string,
): Promise<ActionResult<StudentDetailData>> {
  const result = await universalApi<unknown>({
    endpoint: `/institutes/dashboard/students/${studentId}`,
    method: "GET",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load student details.",
    };
  }

  return { ok: true, data: unwrap<StudentDetailData>(result.data) };
}

/**
 * 4.5 GET /institutes/dashboard/teachers
 * Full teacher list + activity.
 */
export async function getInstituteTeachersDashboardAction(): Promise<
  ActionResult<DashboardTeacherItem[]>
> {
  const result = await universalApi<unknown>({
    endpoint: "/institutes/dashboard/teachers",
    method: "GET",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load teachers.",
    };
  }

  return { ok: true, data: unwrap<DashboardTeacherItem[]>(result.data) };
}

/**
 * 4.6 GET /institutes/dashboard/teachers/:teacherId
 * One teacher detail + student progress + per-batch status.
 */
export async function getInstituteTeacherDetailAction(
  teacherId: string,
): Promise<ActionResult<TeacherDetailData>> {
  const result = await universalApi<unknown>({
    endpoint: `/institutes/dashboard/teachers/${teacherId}`,
    method: "GET",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not load teacher details.",
    };
  }

  return { ok: true, data: unwrap<TeacherDetailData>(result.data) };
}
