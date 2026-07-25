"use server";

import { universalApi } from "@/actions/universal-api";
import { ActionResult } from "@/types/shared";
import { revalidatePath } from "next/cache";
import {
  Homework,
  Submission,
  Batch,
  Lesson,
  Student,
  TeacherHomeworkListItem,
  TeacherHomeworkDetail,
  StudentHomeworkListItem,
  StudentHomeworkDetail,
  HomeworkSubmissionSummary,
  SubmissionDetails,
  HistoryResponse,
  TeacherOverviewResponse,
  StudentOverviewResponse,
  ParentOverviewResponse,
} from "@/types/shared/homework";

// Helper to unwrap nested data property
function unwrap<T>(raw: any): T {
  if (raw && typeof raw === "object" && "data" in raw) {
    return raw.data as T;
  }
  return raw as T;
}

// Helper to unwrap lists from standard API envelopes
function unwrapList<T>(raw: any): T[] {
  if (!raw) return [];
  let payload = raw;
  if (raw && typeof raw === "object" && "data" in raw) {
    payload = raw.data;
  }
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    // Look for any key that contains an array
    for (const key of Object.keys(payload)) {
      if (Array.isArray(payload[key])) {
        return payload[key] as T[];
      }
    }
  }
  return [];
}

// =========================================================================
// TEACHER ACTIONS
// =========================================================================

/**
 * GET /homeworks/teacher
 * Retrieves all homework assignments created by the authenticated teacher, with optional filters.
 */
export async function getTeacherHomeworks(filters?: {
  search?: string;
  status?: string;
  batchId?: string;
  track?: string;
  page?: number;
  limit?: number;
}): Promise<ActionResult<TeacherHomeworkListItem[]>> {
  try {
    const query = new URLSearchParams();
    if (filters?.search) query.set("search", filters.search);
    if (filters?.status) query.set("status", filters.status);
    if (filters?.batchId) query.set("batchId", filters.batchId);
    if (filters?.track) query.set("track", filters.track);
    if (filters?.page) query.set("page", String(filters.page));
    if (filters?.limit) query.set("limit", String(filters.limit));

    const qs = query.toString();
    const endpoint = `/homeworks/teacher${qs ? `?${qs}` : ""}`;
    const res = await universalApi<any>({ endpoint, method: "GET" });

    if (!res.success) {
      return { ok: false, error: res.message || "Failed to fetch teacher homeworks" };
    }

    const payload = res.data || {};
    const meta = payload.meta !== undefined ? payload.meta : payload.data?.meta;
    return {
      ok: true,
      data: unwrapList<TeacherHomeworkListItem>(res.data),
      message: payload.message,
      meta,
    } as any;
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch teacher homeworks" };
  }
}

/**
 * GET /homeworks/teacher/:id
 * Retrieves details for a specific homework assignment created by the teacher.
 */
export async function getHomeworkDetail(id: string): Promise<ActionResult<TeacherHomeworkDetail>> {
  try {
    const res = await universalApi<any>({
      endpoint: `/homeworks/teacher/${id}`,
      method: "GET",
    });

    if (!res.success) {
      return { ok: false, error: res.message || "Failed to fetch homework details" };
    }

    return { ok: true, data: unwrap<TeacherHomeworkDetail>(res.data), message: res.data?.message };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch homework details" };
  }
}

/**
 * GET /teachers/my-batches
 * Retrieves the list of batches assigned to the authenticated teacher.
 */
export async function getBatches(): Promise<ActionResult<Batch[]>> {
  try {
    const res = await universalApi<any>({
      endpoint: "/teachers/my-batches",
      method: "GET",
    });

    if (!res.success) {
      return { ok: false, error: res.message || "Failed to fetch batches" };
    }

    return { ok: true, data: unwrapList<Batch>(res.data) };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch batches" };
  }
}

/**
 * GET /lessons/teacher
 * Retrieves all lessons associated with the authenticated teacher (used to link lessons to homework).
 */
export async function getLessons(): Promise<ActionResult<Lesson[]>> {
  try {
    const res = await universalApi<any>({
      endpoint: "/lessons/teacher",
      method: "GET",
    });

    if (!res.success) {
      return { ok: false, error: res.message || "Failed to fetch lessons" };
    }

    return { ok: true, data: unwrapList<Lesson>(res.data) };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch lessons" };
  }
}

/**
 * GET /homeworks/teacher/batches/:batchId/students
 * Retrieves the students enrolled in a specific batch for the teacher.
 */
export async function getBatchStudents(batchId: string, search?: string): Promise<ActionResult<Student[]>> {
  try {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    const qs = query.toString();
    const endpoint = `/homeworks/teacher/batches/${batchId}/students${qs ? `?${qs}` : ""}`;

    const res = await universalApi<any>({ endpoint, method: "GET" });
    if (!res.success) {
      return { ok: false, error: res.message || "Failed to fetch batch students" };
    }

    return { ok: true, data: unwrapList<Student>(res.data) };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch batch students" };
  }
}

/**
 * POST /homeworks
 * Creates a new homework assignment for a batch or specific students.
 */
export async function createHomework(data: {
  title: string;
  instruction: string;
  batchId: string;
  lessonId: string | null;
  assignedDate: string;
  dueDate: string;
  status: "DRAFT" | "PUBLISHED";
  maxScore: number | null;
  allowLateSubmission: boolean;
  targetType: "BATCH" | "SPECIFIC";
  studentIds?: string[] | null;
}): Promise<ActionResult<Homework>> {
  try {
    const res = await universalApi<any>({
      endpoint: "/homeworks",
      method: "POST",
      data,
    });

    if (!res.success) {
      return {
        ok: false,
        error: res.message || "Failed to create homework",
        errorSource: res.errorSource,
      } as any;
    }

    revalidatePath("/dashboard/teacher/homework");
    return { ok: true, data: unwrap<Homework>(res.data), message: res.data?.message };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to create homework" };
  }
}

/**
 * PATCH /homeworks/teacher/:id
 * Updates an existing homework assignment's details.
 */
export async function updateHomework(
  id: string,
  data: {
    title?: string;
    instruction?: string;
    lessonId?: string | null;
    assignedDate?: string;
    dueDate?: string;
    status?: "DRAFT" | "PUBLISHED";
    maxScore?: number | null;
    allowLateSubmission?: boolean;
    batchId?: string;
    targetType?: "BATCH" | "SPECIFIC";
    studentIds?: string[] | null;
  }
): Promise<ActionResult<Homework>> {
  try {
    // Send only defined fields that the backend expects
    const res = await universalApi<any>({
      endpoint: `/homeworks/teacher/${id}`,
      method: "PATCH",
      data,
    });

    if (!res.success) {
      return {
        ok: false,
        error: res.message || "Failed to update homework",
        errorSource: res.errorSource,
      } as any;
    }

    revalidatePath("/dashboard/teacher/homework");
    revalidatePath(`/dashboard/teacher/homework/${id}`);
    revalidatePath(`/dashboard/teacher/homework/${id}/submissions`);
    return { ok: true, data: unwrap<Homework>(res.data), message: res.data?.message };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to update homework" };
  }
}

/**
 * DELETE /homeworks/teacher/:id
 * Deletes a homework assignment and its associated submissions.
 */
export async function deleteHomework(id: string): Promise<ActionResult<{ id: string; deletedSubmissions: number }>> {
  try {
    const res = await universalApi<any>({
      endpoint: `/homeworks/teacher/${id}`,
      method: "DELETE",
    });

    if (!res.success) {
      return { ok: false, error: res.message || "Failed to delete homework" };
    }

    revalidatePath("/dashboard/teacher/homework");
    return { ok: true, data: unwrap<any>(res.data), message: res.data?.message };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to delete homework" };
  }
}

/**
 * GET /homeworks/teacher/:homeworkId/submissions
 * Retrieves the submission roster (summary, students, status) for a specific homework assignment.
 */
export async function getHomeworkSubmissions(
  homeworkId: string,
  filters?: { status?: string; track?: string; page?: number; limit?: number }
): Promise<ActionResult<HomeworkSubmissionSummary>> {
  try {
    const query = new URLSearchParams();
    if (filters?.status) query.set("status", filters.status);
    if (filters?.track) query.set("track", filters.track);
    if (filters?.page) query.set("page", String(filters.page));
    if (filters?.limit) query.set("limit", String(filters.limit));

    const qs = query.toString();
    const endpoint = `/homeworks/teacher/${homeworkId}/submissions${qs ? `?${qs}` : ""}`;

    const res = await universalApi<any>({
      endpoint,
      method: "GET",
    });

    if (!res.success) {
      return { ok: false, error: res.message || "Failed to fetch submissions roster" };
    }

    const payload = res.data || {};
    const homework = payload.homework !== undefined ? payload.homework : payload.data?.homework;
    const summary = payload.summary !== undefined ? payload.summary : payload.data?.summary;
    const results = unwrapList<any>(payload.results !== undefined ? payload.results : payload.data?.results);
    const meta = payload.meta !== undefined ? payload.meta : payload.data?.meta;
    return {
      ok: true,
      data: { homework, summary, results },
      message: payload.message,
      meta,
    } as any;
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch submissions roster" };
  }
}

/**
 * GET /homeworks/teacher/submissions/:submissionId
 * Retrieves detailed submission data (student answer, files, note) for grading.
 */
export async function getSubmissionDetails(submissionId: string): Promise<ActionResult<SubmissionDetails>> {
  try {
    const res = await universalApi<any>({
      endpoint: `/homeworks/teacher/submissions/${submissionId}`,
      method: "GET",
    });

    if (!res.success) {
      return { ok: false, error: res.message || "Failed to fetch submission details" };
    }

    return { ok: true, data: unwrap<SubmissionDetails>(res.data) };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch submission details" };
  }
}

/**
 * PATCH /homeworks/teacher/submissions/:submissionId/grade
 * Grades a student's homework submission (sets score and feedback).
 */
export async function gradeSubmission(
  submissionId: string,
  payload: {
    score?: number | null;
    feedback: string | null;
    isCompleted?: boolean;
  }
): Promise<ActionResult<Submission>> {
  try {
    const res = await universalApi<any>({
      endpoint: `/homeworks/teacher/submissions/${submissionId}/grade`,
      method: "PATCH",
      data: payload,
    });

    if (!res.success) {
      return { ok: false, error: res.message || "Failed to grade submission" };
    }

    const homeworkId = res.data?.data?.homeworkId;
    if (homeworkId) {
      revalidatePath(`/dashboard/teacher/homework/${homeworkId}/submissions`);
    }
    revalidatePath("/dashboard/teacher/homework");
    revalidatePath(`/dashboard/teacher/homework/submissions/${submissionId}`);
    return { ok: true, data: unwrap<Submission>(res.data), message: res.data?.message };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to grade submission" };
  }
}

/**
 * PATCH /homeworks/teacher/submissions/bulk-grade
 * Bulk grades multiple homework submissions at once.
 */
export async function bulkGradeSubmissions(grades: {
  submissionId: string;
  isCompleted?: boolean;
  score?: number | null;
  feedback?: string | null;
}[]): Promise<ActionResult<any>> {
  try {
    const res = await universalApi<any>({
      endpoint: "/homeworks/teacher/submissions/bulk-grade",
      method: "PATCH",
      data: { grades },
    });

    if (!res.success) {
      return { ok: false, error: res.message || "Failed to execute bulk grading" };
    }

    revalidatePath("/dashboard/teacher/homework");
    return { ok: true, data: unwrap<any>(res.data), message: res.data?.message };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to execute bulk grading" };
  }
}

/**
 * GET /homeworks/teacher/history
 * Retrieves a history timeline of homework assignments for the teacher.
 */
export async function getTeacherHomeworkHistory(filters?: {
  batchId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}): Promise<ActionResult<HistoryResponse>> {
  try {
    const query = new URLSearchParams();
    if (filters?.batchId) query.set("batchId", filters.batchId);
    if (filters?.from) query.set("from", filters.from);
    if (filters?.to) query.set("to", filters.to);
    if (filters?.page) query.set("page", String(filters.page));
    if (filters?.limit) query.set("limit", String(filters.limit));

    const qs = query.toString();
    const endpoint = `/homeworks/teacher/history${qs ? `?${qs}` : ""}`;

    const res = await universalApi<any>({
      endpoint,
      method: "GET",
    });

    if (!res.success) {
      return { ok: false, error: res.message || "Failed to fetch homework history" };
    }

    const payload = res.data || {};
    const days = unwrapList<any>(payload.days !== undefined ? payload.days : payload.data?.days);
    const meta = payload.meta !== undefined ? payload.meta : payload.data?.meta;
    return {
      ok: true,
      data: { days },
      meta,
      message: payload.message,
    } as any;
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch homework history" };
  }
}

/**
 * GET /homeworks/teacher/overview
 * Retrieves an overview summary of homework metrics (stats/graphs) for the teacher.
 */
export async function getTeacherHomeworkOverview(month?: string, batchId?: string): Promise<ActionResult<TeacherOverviewResponse>> {
  try {
    const query = new URLSearchParams();
    if (month) query.set("month", month);
    if (batchId) query.set("batchId", batchId);
    const qs = query.toString();
    const endpoint = `/homeworks/teacher/overview${qs ? `?${qs}` : ""}`;

    const res = await universalApi<any>({
      endpoint,
      method: "GET",
    });

    if (!res.success) {
      return { ok: false, error: res.message || "Failed to fetch teacher overview" };
    }

    return { ok: true, data: unwrap<TeacherOverviewResponse>(res.data) };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch teacher overview" };
  }
}

// =========================================================================
// STUDENT ACTIONS
// =========================================================================

/**
 * GET /homeworks/student
 * Retrieves all homework assignments assigned to the authenticated student.
 */
export async function getStudentHomeworks(filters?: {
  status?: string;
  track?: string;
  page?: number;
  limit?: number;
}): Promise<ActionResult<StudentHomeworkListItem[]>> {
  try {
    const query = new URLSearchParams();
    if (filters?.status) query.set("status", filters.status);
    if (filters?.track) query.set("track", filters.track);
    if (filters?.page) query.set("page", String(filters.page));
    if (filters?.limit) query.set("limit", String(filters.limit));

    const qs = query.toString();
    const endpoint = `/homeworks/student${qs ? `?${qs}` : ""}`;

    const res = await universalApi<any>({
      endpoint,
      method: "GET",
    });

    if (!res.success) {
      return { ok: false, error: res.message || "Failed to fetch student homeworks" };
    }

    const payload = res.data || {};
    const meta = payload.meta !== undefined ? payload.meta : payload.data?.meta;
    return {
      ok: true,
      data: unwrapList<StudentHomeworkListItem>(res.data),
      meta,
      message: payload.message,
    } as any;
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch student homeworks" };
  }
}

/**
 * GET /homeworks/student/:homeworkId
 * Retrieves detailed homework information and submission status for the student.
 */
export async function getStudentHomeworkDetail(homeworkId: string): Promise<ActionResult<StudentHomeworkDetail>> {
  try {
    const res = await universalApi<any>({
      endpoint: `/homeworks/student/${homeworkId}`,
      method: "GET",
    });

    if (!res.success) {
      return { ok: false, error: res.message || "Failed to fetch student homework detail" };
    }

    return { ok: true, data: unwrap<StudentHomeworkDetail>(res.data) };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch student homework detail" };
  }
}

/**
 * POST /homeworks/student/:homeworkId/submit
 * Submits homework answers and attachments for a student.
 */
export async function submitStudentHomework(
  homeworkId: string,
  payload: {
    note: string | null;
    attachments: {
      type: "IMAGE" | "PDF" | "YOUTUBE" | "LINK";
      url: string;
      fileName: string | null;
    }[];
  }
): Promise<ActionResult<Submission>> {
  try {
    const res = await universalApi<any>({
      endpoint: `/homeworks/student/${homeworkId}/submit`,
      method: "POST",
      data: payload,
    });

    if (!res.success) {
      return { ok: false, error: res.message || "Failed to submit homework" };
    }

    revalidatePath("/dashboard/student/homework");
    revalidatePath(`/dashboard/student/homework/${homeworkId}`);
    return { ok: true, data: unwrap<Submission>(res.data), message: res.data?.message };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to submit homework" };
  }
}

/**
 * GET /homeworks/student/overview
 * Retrieves an overview summary of homework metrics (stats/graphs) for the student.
 */
export async function getStudentHomeworkOverview(month?: string): Promise<ActionResult<StudentOverviewResponse>> {
  try {
    const query = new URLSearchParams();
    if (month) query.set("month", month);
    const qs = query.toString();
    const endpoint = `/homeworks/student/overview${qs ? `?${qs}` : ""}`;

    const res = await universalApi<any>({
      endpoint,
      method: "GET",
    });

    if (!res.success) {
      return { ok: false, error: res.message || "Failed to fetch student overview" };
    }

    return { ok: true, data: unwrap<StudentOverviewResponse>(res.data) };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch student overview" };
  }
}

// =========================================================================
// PARENT ACTIONS
// =========================================================================

export interface ParentHomeworkData {
  children: Student[];
  results: {
    assignmentId: string;
    student: { id: string; name: string };
    homework: Homework;
    status: "NOT_SUBMITTED" | "SUBMITTED" | "GRADED";
    submittedAt: string | null;
    isLate: boolean;
    score: number | null;
    feedback: string | null;
    chip: "NOT_SUBMITTED" | "OVERDUE" | "SUBMITTED" | "SUBMITTED_LATE" | "GRADED" | "GRADED_LATE";
  }[];
}

/**
 * GET /homeworks/parent
 * Retrieves parent's children listing and children's homework list (status, scores, feedback).
 */
export async function getParentHomeworkData(filters?: {
  studentId?: string;
  status?: string;
  track?: string;
  page?: number;
  limit?: number;
}): Promise<ActionResult<ParentHomeworkData>> {
  try {
    const query = new URLSearchParams();
    if (filters?.studentId) query.set("studentId", filters.studentId);
    if (filters?.status) query.set("status", filters.status);
    if (filters?.track) query.set("track", filters.track);
    if (filters?.page) query.set("page", String(filters.page));
    if (filters?.limit) query.set("limit", String(filters.limit));

    const qs = query.toString();
    const endpoint = `/homeworks/parent${qs ? `?${qs}` : ""}`;

    const res = await universalApi<any>({
      endpoint,
      method: "GET",
    });

    if (!res.success) {
      return { ok: false, error: res.message || "Failed to fetch parent homework dashboard" };
    }

    const payload = res.data || {};
    const children = unwrapList<Student>(payload.children !== undefined ? payload.children : payload.data?.children);
    const results = unwrapList<any>(payload.results !== undefined ? payload.results : payload.data?.results);
    const meta = payload.meta !== undefined ? payload.meta : payload.data?.meta;
    return {
      ok: true,
      data: { children, results },
      meta,
      message: payload.message,
    } as any;
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch parent homework dashboard" };
  }
}

/**
 * GET /homeworks/parent/overview
 * Retrieves homework performance overview metrics for a parent's student children.
 */
export async function getParentHomeworkOverview(studentId?: string, month?: string): Promise<ActionResult<ParentOverviewResponse>> {
  try {
    const query = new URLSearchParams();
    if (studentId) query.set("studentId", studentId);
    if (month) query.set("month", month);
    const qs = query.toString();
    const endpoint = `/homeworks/parent/overview${qs ? `?${qs}` : ""}`;

    const res = await universalApi<any>({
      endpoint,
      method: "GET",
    });

    if (!res.success) {
      return { ok: false, error: res.message || "Failed to fetch parent overview" };
    }

    return { ok: true, data: unwrap<ParentOverviewResponse>(res.data) };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch parent overview" };
  }
}
