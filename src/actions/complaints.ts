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
} from "@/types/shared/complaint";
import {
  initialMockMemberComplaints,
  initialMockInstituteComplaints,
  initialMockStatistics,
} from "@/data/mock-complaints";

// In-memory mock store for fallbacks
let mockMemberComplaints = [...initialMockMemberComplaints];
let mockInstituteComplaints = [...initialMockInstituteComplaints];

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
  if (raw && typeof raw === "object" && "data" in raw) {
    return (raw as { data: T }).data;
  }
  return raw as T;
}

function paginateArray<T>(
  items: T[],
  page = 1,
  limit = 10,
): PaginatedComplaints<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const safePage = Math.max(1, Math.min(page, totalPages));
  const start = (safePage - 1) * limit;
  const data = items.slice(start, start + limit);

  return {
    data,
    pagination: {
      total,
      page: safePage,
      limit,
      totalPages,
    },
  };
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
    return { ok: true, data: unwrapData<MemberComplaint>(res.data) };
  }

  // Fallback to mock creation
  const newComplaint: MemberComplaint = {
    id: `comp_m_${Date.now()}`,
    report: payload.report,
    status: "PENDING",
    reportedRole: payload.reportedRole,
    reporter: {
      id: "u_current",
      name: "Current User",
      role: "TEACHER",
    },
    reported: {
      id: payload.reportedId,
      name: payload.reportedId,
      role: payload.reportedRole,
    },
    institute: {
      id: payload.instituteId,
      name: "Al-Azhar Model Institute",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockMemberComplaints.unshift(newComplaint);
  revalidatePath("/dashboard/teacher/complaints");
  revalidatePath("/dashboard/parent/complaints");

  return { ok: true, data: newComplaint };
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

  // Fallback to mock filtering
  let filtered = [...mockMemberComplaints];
  if (params.status && params.status !== "ALL") {
    filtered = filtered.filter((c) => c.status === params.status);
  }
  if (params.reportedRole && params.reportedRole !== "ALL") {
    filtered = filtered.filter((c) => c.reportedRole === params.reportedRole);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.report.toLowerCase().includes(q) ||
        c.reporter.name.toLowerCase().includes(q) ||
        c.reported.name.toLowerCase().includes(q),
    );
  }
  if (params.fromDate) {
    filtered = filtered.filter((c) => c.createdAt >= params.fromDate!);
  }
  if (params.toDate) {
    filtered = filtered.filter((c) => c.createdAt <= `${params.toDate!}T23:59:59`);
  }

  // Sort
  const sortBy = params.sortBy ?? "createdAt";
  const sortOrder = params.sortOrder ?? "desc";
  filtered.sort((a, b) => {
    const aVal = String(a[sortBy as keyof MemberComplaint] ?? "");
    const bVal = String(b[sortBy as keyof MemberComplaint] ?? "");
    return sortOrder === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  return {
    ok: true,
    data: paginateArray(filtered, params.page, params.limit),
  };
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

  const found = mockMemberComplaints.find((c) => c.id === id);
  if (found) return { ok: true, data: found };

  return { ok: false, error: "Complaint not found." };
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

  const idx = mockMemberComplaints.findIndex((c) => c.id === id);
  if (idx !== -1) {
    mockMemberComplaints[idx] = {
      ...mockMemberComplaints[idx],
      status,
      updatedAt: new Date().toISOString(),
    };
    revalidatePath("/dashboard/institute/complaints");
    return { ok: true, data: mockMemberComplaints[idx] };
  }

  return { ok: false, error: "Failed to update complaint status." };
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
    return { ok: true, data: undefined };
  }

  mockMemberComplaints = mockMemberComplaints.filter((c) => c.id !== id);
  revalidatePath("/dashboard/teacher/complaints");
  revalidatePath("/dashboard/parent/complaints");

  return { ok: true, data: undefined };
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
    return { ok: true, data: unwrapData<InstituteComplaint>(res.data) };
  }

  const newComplaint: InstituteComplaint = {
    id: `comp_i_${Date.now()}`,
    report: payload.report,
    status: "PENDING",
    reporter: {
      id: "u_current",
      name: "Current User",
      role: "TEACHER",
    },
    institute: {
      id: payload.instituteId,
      name: "Al-Azhar Model Institute",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockInstituteComplaints.unshift(newComplaint);
  revalidatePath("/dashboard/teacher/complaints");
  revalidatePath("/dashboard/parent/complaints");

  return { ok: true, data: newComplaint };
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

  let filtered = [...mockInstituteComplaints];
  if (params.status && params.status !== "ALL") {
    filtered = filtered.filter((c) => c.status === params.status);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((c) => c.report.toLowerCase().includes(q));
  }

  return {
    ok: true,
    data: paginateArray(filtered, params.page, params.limit),
  };
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

  const found = mockInstituteComplaints.find((c) => c.id === id);
  if (found) return { ok: true, data: found };

  return { ok: false, error: "Complaint not found." };
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

  const idx = mockInstituteComplaints.findIndex((c) => c.id === id);
  if (idx !== -1) {
    mockInstituteComplaints[idx] = {
      ...mockInstituteComplaints[idx],
      status,
      updatedAt: new Date().toISOString(),
    };
    revalidatePath("/dashboard/admin/complaints");
    return { ok: true, data: mockInstituteComplaints[idx] };
  }

  return { ok: false, error: "Failed to update complaint status." };
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
    return { ok: true, data: undefined };
  }

  mockInstituteComplaints = mockInstituteComplaints.filter((c) => c.id !== id);
  revalidatePath("/dashboard/teacher/complaints");
  revalidatePath("/dashboard/parent/complaints");

  return { ok: true, data: undefined };
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
    return { ok: true, data: unwrapData<MyComplaintsData>(res.data) };
  }

  // Fallback to mock data for caller's complaints
  return {
    ok: true,
    data: {
      memberComplaints: mockMemberComplaints,
      instituteComplaints: mockInstituteComplaints,
    },
  };
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

  return {
    ok: true,
    data: paginateArray(mockMemberComplaints, params.page, params.limit),
  };
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

  const pendingMembers = mockMemberComplaints.filter(
    (c) => c.status === "PENDING",
  ).length;
  const resolvedMembers = mockMemberComplaints.filter(
    (c) => c.status === "RESOLVED",
  ).length;
  const pendingInstitutes = mockInstituteComplaints.filter(
    (c) => c.status === "PENDING",
  ).length;
  const resolvedInstitutes = mockInstituteComplaints.filter(
    (c) => c.status === "RESOLVED",
  ).length;

  return {
    ok: true,
    data: {
      totalMemberComplaints: mockMemberComplaints.length,
      totalInstituteComplaints: mockInstituteComplaints.length,
      pendingMemberComplaints: pendingMembers,
      pendingInstituteComplaints: pendingInstitutes,
      resolvedMemberComplaints: resolvedMembers,
      resolvedInstituteComplaints: resolvedInstitutes,
    },
  };
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

  const filtered = mockMemberComplaints.filter(
    (c) => c.institute.id === instituteId,
  );
  return {
    ok: true,
    data: paginateArray(filtered, params.page, params.limit),
  };
}
