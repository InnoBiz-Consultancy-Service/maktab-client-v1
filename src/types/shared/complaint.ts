/** Complaint module — shared types used across all roles. */

export type ComplaintStatus = "PENDING" | "RESOLVED";

/** Domain roles that can be targeted in a Layer-1 member complaint. */
export type ReportedRole = "TEACHER" | "STUDENT" | "PARENT";

/** Sort fields accepted by the API. */
export type ComplaintSortBy = "createdAt" | "updatedAt" | "status";
export type SortOrder = "asc" | "desc";

// ─── Shared sub-shapes (from API response) ───────────────────────────────────

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
  email?: string;
}

// ─── Layer 1 — Member Complaint ───────────────────────────────────────────────

export interface MemberComplaint {
  id: string;
  reportText: string;
  status: ComplaintStatus;
  reportedRole: ReportedRole | null;
  reportedId: string | null;
  reporterId: string;
  reporterRole: "TEACHER" | "PARENT";
  instituteId: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Populated by backend joins (may be present in responses)
  reporter?: ComplaintReporter;
  reported?: ComplaintTarget;
  institute?: ComplaintInstitute;
}

// ─── Layer 2 — Institute Complaint ───────────────────────────────────────────

export interface InstituteComplaint {
  id: string;
  reportText: string;
  status: ComplaintStatus;
  reporterId: string;
  reporterRole: "TEACHER" | "PARENT";
  instituteId: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Populated by backend joins (may be present in responses)
  reporter?: ComplaintReporter;
  institute?: ComplaintInstitute;
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
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
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
  memberComplaints: {
    total: number;
    byStatus: {
      PENDING: number;
      RESOLVED: number;
    };
  };
  instituteComplaints: {
    total: number;
    byStatus: {
      PENDING: number;
      RESOLVED: number;
    };
  };
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface FileMemberComplaintPayload {
  reportText: string;
  reportedId?: string;
  reportedRole?: ReportedRole;
  instituteId?: string;
}

export interface FileInstituteComplaintPayload {
  reportText: string;
  instituteId?: string;
}

export interface UpdateComplaintStatusPayload {
  status: ComplaintStatus;
}

// ─── Directory & Lookup Types ──────────────────────────────────────────────────

export interface TeacherDirectoryItem {
  id: string;
  name: string;
}

export interface ParentInstituteItem {
  id: string;
  name: string;
}

export interface GetTeacherDirectoryParams {
  instituteId?: string;
  search?: string;
}
