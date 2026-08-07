"use server";

import { universalApi } from "@/actions/universal-api";
import type { ActionResult } from "@/types/shared";
import { revalidatePath } from "next/cache";
import type {
  MemberComplaint,
  InstituteComplaint,
  MyComplaintsData,
  ComplaintStatistics,
  PaginatedComplaints,
  ComplaintQueryParams,
  FileMemberComplaintPayload,
  FileInstituteComplaintPayload,
  UpdateComplaintStatusPayload,
  TeacherDirectoryItem,
  ParentInstituteItem,
  GetTeacherDirectoryParams,
} from "@/types/shared/complaint";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildQueryString(params: ComplaintQueryParams): string {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.sortBy) q.set("sortBy", params.sortBy);
  if (params.sortOrder) q.set("sortOrder", params.sortOrder);
  if (params.status && params.status !== "ALL") q.set("status", params.status);
  if (params.fromDate) q.set("fromDate", params.fromDate);
  if (params.toDate) q.set("toDate", params.toDate);
  if (params.reportedRole && params.reportedRole !== "ALL")
    q.set("reportedRole", params.reportedRole);
  if (params.search) q.set("search", params.search);
  if (params.instituteId) q.set("instituteId", params.instituteId);
  const qs = q.toString();
  return qs ? `?${qs}` : "";
}

function unwrapData<T>(raw: unknown): T {
  if (
    raw &&
    typeof raw === "object" &&
    "data" in raw &&
    (raw as { data: unknown }).data !== undefined
  ) {
    const rawObj = raw as { data: unknown; pagination?: unknown };
    // If raw itself has 'pagination', it's already unwrapped PaginatedComplaints
    if ("pagination" in rawObj) {
      return raw as T;
    }
    return rawObj.data as T;
  }
  return raw as T;
}

function extractError(res: { message?: string }): string {
  return res.message ?? "Something went wrong. Please try again.";
}

// ─── Layer 1: Member Complaints ───────────────────────────────────────────────

/** Teacher or Parent files a complaint against a member (L1). */
export async function fileMemberComplaintAction(
  payload: FileMemberComplaintPayload,
): Promise<ActionResult<MemberComplaint>> {
  const res = await universalApi<MemberComplaint>({
    endpoint: "/complains/members",
    method: "POST",
    data: payload,
  });

  if (res.success && res.data) {
    revalidatePath("/dashboard/teacher/complaints");
    revalidatePath("/dashboard/parent/complaints");
    revalidatePath("/dashboard/institute/complaints");
    revalidatePath("/dashboard/admin/complaints");
    return { ok: true, data: unwrapData<MemberComplaint>(res.data) };
  }

  return { ok: false, error: extractError(res) };
}

/** Institute fetches all Layer-1 complaints filed against its members. */
export async function getInstituteMemberComplaintsAction(
  params: ComplaintQueryParams = {},
): Promise<ActionResult<PaginatedComplaints<MemberComplaint>>> {
  const qs = buildQueryString(params);
  const res = await universalApi<PaginatedComplaints<MemberComplaint>>({
    endpoint: `/complains/members${qs}`,
    method: "GET",
  });

  if (res.success && res.data) {
    return {
      ok: true,
      data: unwrapData<PaginatedComplaints<MemberComplaint>>(res.data),
    };
  }

  return { ok: false, error: extractError(res) };
}

/** Get a single Layer-1 member complaint by ID. */
export async function getMemberComplaintByIdAction(
  id: string,
): Promise<ActionResult<MemberComplaint>> {
  const res = await universalApi<MemberComplaint>({
    endpoint: `/complains/members/${id}`,
    method: "GET",
  });

  if (res.success && res.data) {
    return { ok: true, data: unwrapData<MemberComplaint>(res.data) };
  }

  return { ok: false, error: extractError(res) };
}

/** Institute updates the status of a Layer-1 complaint (PENDING → RESOLVED). */
export async function updateMemberComplaintStatusAction(
  id: string,
  status: UpdateComplaintStatusPayload["status"],
): Promise<ActionResult<MemberComplaint>> {
  const res = await universalApi<MemberComplaint>({
    endpoint: `/complains/members/${id}/status`,
    method: "PATCH",
    data: { status } satisfies UpdateComplaintStatusPayload,
  });

  if (res.success && res.data) {
    revalidatePath("/dashboard/institute/complaints");
    return { ok: true, data: unwrapData<MemberComplaint>(res.data) };
  }

  return { ok: false, error: extractError(res) };
}

/** Reporter (Teacher/Parent) soft-deletes (withdraws) their own Layer-1 complaint. */
export async function deleteMemberComplaintAction(
  id: string,
): Promise<ActionResult<void>> {
  const res = await universalApi({
    endpoint: `/complains/members/${id}`,
    method: "DELETE",
  });

  if (res.success) {
    revalidatePath("/dashboard/teacher/complaints");
    revalidatePath("/dashboard/parent/complaints");
    revalidatePath("/dashboard/institute/complaints");
    revalidatePath("/dashboard/admin/complaints");
    return { ok: true, data: undefined };
  }

  return { ok: false, error: extractError(res) };
}

// ─── Layer 2: Institute Complaints ───────────────────────────────────────────

/** Teacher or Parent files a complaint against an Institute (L2). */
export async function fileInstituteComplaintAction(
  payload: FileInstituteComplaintPayload,
): Promise<ActionResult<InstituteComplaint>> {
  const res = await universalApi<InstituteComplaint>({
    endpoint: "/complains/institutes",
    method: "POST",
    data: payload,
  });

  if (res.success && res.data) {
    revalidatePath("/dashboard/teacher/complaints");
    revalidatePath("/dashboard/parent/complaints");
    revalidatePath("/dashboard/admin/complaints");
    return { ok: true, data: unwrapData<InstituteComplaint>(res.data) };
  }

  return { ok: false, error: extractError(res) };
}

/** Admin fetches all Layer-2 institute complaints. */
export async function getAdminInstituteComplaintsAction(
  params: ComplaintQueryParams = {},
): Promise<ActionResult<PaginatedComplaints<InstituteComplaint>>> {
  const qs = buildQueryString(params);
  const res = await universalApi<PaginatedComplaints<InstituteComplaint>>({
    endpoint: `/complains/institutes${qs}`,
    method: "GET",
  });

  if (res.success && res.data) {
    return {
      ok: true,
      data: unwrapData<PaginatedComplaints<InstituteComplaint>>(res.data),
    };
  }

  return { ok: false, error: extractError(res) };
}

/** Admin gets a single Layer-2 institute complaint by ID. */
export async function getAdminInstituteComplaintByIdAction(
  id: string,
): Promise<ActionResult<InstituteComplaint>> {
  const res = await universalApi<InstituteComplaint>({
    endpoint: `/complains/institutes/${id}`,
    method: "GET",
  });

  if (res.success && res.data) {
    return { ok: true, data: unwrapData<InstituteComplaint>(res.data) };
  }

  return { ok: false, error: extractError(res) };
}

/** Admin updates the status of a Layer-2 institute complaint. */
export async function updateInstituteComplaintStatusAction(
  id: string,
  status: UpdateComplaintStatusPayload["status"],
): Promise<ActionResult<InstituteComplaint>> {
  const res = await universalApi<InstituteComplaint>({
    endpoint: `/complains/institutes/${id}/status`,
    method: "PATCH",
    data: { status } satisfies UpdateComplaintStatusPayload,
  });

  if (res.success && res.data) {
    revalidatePath("/dashboard/admin/complaints");
    return { ok: true, data: unwrapData<InstituteComplaint>(res.data) };
  }

  return { ok: false, error: extractError(res) };
}

/** Reporter soft-deletes their own Layer-2 institute complaint. */
export async function deleteInstituteComplaintAction(
  id: string,
): Promise<ActionResult<void>> {
  const res = await universalApi({
    endpoint: `/complains/institutes/${id}`,
    method: "DELETE",
  });

  if (res.success) {
    revalidatePath("/dashboard/teacher/complaints");
    revalidatePath("/dashboard/parent/complaints");
    revalidatePath("/dashboard/admin/complaints");
    return { ok: true, data: undefined };
  }

  return { ok: false, error: extractError(res) };
}

// ─── My Complaints (Reporter view) ───────────────────────────────────────────

/** Fetch the authenticated user's own filed complaints (both L1 and L2). */
export async function getMyComplaintsAction(
  params: ComplaintQueryParams = {},
): Promise<ActionResult<MyComplaintsData>> {
  const qs = buildQueryString(params);
  const res = await universalApi<MyComplaintsData>({
    endpoint: `/complains/my${qs}`,
    method: "GET",
  });

  if (res.success && res.data) {
    // /complains/my wraps in { data: { memberComplaints, instituteComplaints }, pagination }
    // unwrapData peels the outer envelope, leaving { data: { memberComplaints, ... }, pagination }
    // We then pull .data off that to get the actual arrays.
    const outer = unwrapData<{ data: MyComplaintsData; pagination: unknown } | MyComplaintsData>(res.data);
    const inner: MyComplaintsData =
      outer && typeof outer === "object" && "memberComplaints" in outer
        ? (outer as MyComplaintsData)
        : ((outer as { data: MyComplaintsData }).data ?? { memberComplaints: [], instituteComplaints: [] });

    return { ok: true, data: inner };
  }

  return { ok: false, error: extractError(res) };
}

// ─── Admin-specific endpoints ─────────────────────────────────────────────────

/** Admin fetches all Layer-1 member complaints across all institutes. */
export async function getAdminAllMemberComplaintsAction(
  params: ComplaintQueryParams = {},
): Promise<ActionResult<PaginatedComplaints<MemberComplaint>>> {
  const qs = buildQueryString(params);
  const res = await universalApi<PaginatedComplaints<MemberComplaint>>({
    endpoint: `/complains/admin/members${qs}`,
    method: "GET",
  });

  if (res.success && res.data) {
    return {
      ok: true,
      data: unwrapData<PaginatedComplaints<MemberComplaint>>(res.data),
    };
  }

  return { ok: false, error: extractError(res) };
}

/** Admin fetches global complaint statistics. */
export async function getAdminComplaintStatisticsAction(): Promise<
  ActionResult<ComplaintStatistics>
> {
  const res = await universalApi<ComplaintStatistics>({
    endpoint: "/complains/admin/statistics",
    method: "GET",
  });

  if (res.success && res.data) {
    return { ok: true, data: unwrapData<ComplaintStatistics>(res.data) };
  }

  return { ok: false, error: extractError(res) };
}

/** Admin fetches complaints scoped to a specific institute. */
export async function getAdminComplaintsByInstituteAction(
  instituteId: string,
  params: ComplaintQueryParams = {},
): Promise<ActionResult<PaginatedComplaints<MemberComplaint>>> {
  const qs = buildQueryString(params);
  const res = await universalApi<PaginatedComplaints<MemberComplaint>>({
    endpoint: `/complains/admin/institutes/${instituteId}${qs}`,
    method: "GET",
  });

  if (res.success && res.data) {
    return {
      ok: true,
      data: unwrapData<PaginatedComplaints<MemberComplaint>>(res.data),
    };
  }

  return { ok: false, error: extractError(res) };
}

// ─── Directory & Lookup Endpoints ─────────────────────────────────────────────

/**
 * Fetch teacher directory for resolving target teacher ID when filing a complaint.
 * Endpoint: GET /teachers/directory
 * Auth: TEACHER, PARENT
 * Query params: instituteId (required for PARENT, ignored for TEACHER), search (optional)
 */
export async function getTeacherDirectoryAction(
  params: GetTeacherDirectoryParams = {},
): Promise<ActionResult<TeacherDirectoryItem[]>> {
  const q = new URLSearchParams();
  if (params.instituteId) q.set("instituteId", params.instituteId);
  if (params.search) q.set("search", params.search);
  const qs = q.toString() ? `?${q.toString()}` : "";

  const res = await universalApi<TeacherDirectoryItem[]>({
    endpoint: `/teachers/directory${qs}`,
    method: "GET",
  });

  if (res.success && res.data) {
    return { ok: true, data: unwrapData<TeacherDirectoryItem[]>(res.data) };
  }

  return { ok: false, error: extractError(res) };
}

/**
 * Fetch distinct institutes where the parent has at least one active child.
 * Endpoint: GET /parents/my-institutes
 * Auth: PARENT
 */
export async function getParentInstitutesAction(): Promise<
  ActionResult<ParentInstituteItem[]>
> {
  const res = await universalApi<ParentInstituteItem[]>({
    endpoint: "/parents/my-institutes",
    method: "GET",
  });

  if (res.success && res.data) {
    return { ok: true, data: unwrapData<ParentInstituteItem[]>(res.data) };
  }

  return { ok: false, error: extractError(res) };
}
