/** Complaint module — shared types used across all roles. */

export type ComplaintStatus = "PENDING" | "RESOLVED";

/** Domain roles that can be targeted in a Layer-1 member complaint. */
export type ReportedRole = "TEACHER" | "STUDENT" | "PARENT";

/** Sort fields accepted by the API. */
export type ComplaintSortBy = "createdAt" | "updatedAt" | "status";
export type SortOrder = "asc" | "desc";

// ─── Shared sub-shapes ───────────────────────────────────────────────────────

export interface ComplaintReporter {
  id: string;
  name: string;
  role: "TEACHER" | "PARENT";
}

export interface ComplaintTarget {
  id: string;
  name: string;
  role: ReportedRole;
}

export interface ComplaintInstitute {
  id: string;
  name: string;
}

// ─── Layer 1 — Member Complaint ───────────────────────────────────────────────

export interface MemberComplaint {
  id: string;
  report: string;
  status: ComplaintStatus;
  reportedRole: ReportedRole;
  reporter: ComplaintReporter;
  reported: ComplaintTarget;
  institute: ComplaintInstitute;
  createdAt: string;
  updatedAt: string;
}

// ─── Layer 2 — Institute Complaint ───────────────────────────────────────────

export interface InstituteComplaint {
  id: string;
  report: string;
  status: ComplaintStatus;
  reporter: ComplaintReporter;
  institute: ComplaintInstitute;
  createdAt: string;
  updatedAt: string;
}

// ─── "My Complaints" — combined view for the reporter ────────────────────────

export interface MyMemberComplaint extends MemberComplaint {
  layer: "MEMBER";
}

export interface MyInstituteComplaint extends InstituteComplaint {
  layer: "INSTITUTE";
}

export type MyComplaint = MyMemberComplaint | MyInstituteComplaint;

export interface MyComplaintsData {
  memberComplaints: MemberComplaint[];
  instituteComplaints: InstituteComplaint[];
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface ComplaintPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedComplaints<T> {
  data: T[];
  pagination: ComplaintPagination;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface ComplaintQueryParams {
  page?: number;
  limit?: number;
  sortBy?: ComplaintSortBy;
  sortOrder?: SortOrder;
  status?: ComplaintStatus | "ALL";
  fromDate?: string;
  toDate?: string;
  reportedRole?: ReportedRole | "ALL";
  search?: string;
  instituteId?: string;
}

// ─── Statistics (Admin) ───────────────────────────────────────────────────────

export interface ComplaintStatistics {
  totalMemberComplaints: number;
  totalInstituteComplaints: number;
  pendingMemberComplaints: number;
  pendingInstituteComplaints: number;
  resolvedMemberComplaints: number;
  resolvedInstituteComplaints: number;
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface FileMemberComplaintPayload {
  report: string;
  reportedId: string;
  reportedRole: ReportedRole;
  instituteId: string;
}

export interface FileInstituteComplaintPayload {
  report: string;
  instituteId: string;
}

export interface UpdateComplaintStatusPayload {
  status: ComplaintStatus;
}
