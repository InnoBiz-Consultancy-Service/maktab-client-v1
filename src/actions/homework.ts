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
    revalidatePath("/dashboard/student/homework");
    revalidatePath("/dashboard/parent/homework");
    revalidatePath("/dashboard/parent/children");
    revalidatePath("/dashboard/student");
    revalidatePath("/dashboard/parent");
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

    // Also fetch full homework details so we have batch info & fallback data
    const detailRes = await getHomeworkDetail(homeworkId);
    const detailData = detailRes.ok ? detailRes.data : null;

    const rawPayload = res.success ? (unwrap<any>(res.data) || {}) : {};
    const detailPayload = detailData ? (unwrap<any>(detailData) || {}) : {};
    
    let homework = rawPayload.homework ?? rawPayload.data?.homework ?? detailPayload.homework ?? detailData;
    if (!homework && detailData) homework = detailData;

    const rawResults = unwrapList<any>(
      rawPayload.results ?? 
      rawPayload.roster ?? 
      rawPayload.students ?? 
      rawPayload.submissions ?? 
      rawPayload.assignments ?? 
      rawPayload.data?.results ??
      rawPayload.data?.roster ??
      rawPayload.data?.students ??
      rawPayload.data?.submissions ??
      detailPayload.submissions ??
      detailPayload.results ??
      detailPayload.roster ??
      detailPayload.students ??
      (Array.isArray(rawPayload) ? rawPayload : [])
    );

    // Fetch batch students if available to guarantee ALL assigned students appear in the roster
    const batchId = homework?.batch?.id || homework?.batchId;
    let batchStudents: Student[] = [];
    if (batchId) {
      const batchRes = await getBatchStudents(batchId);
      if (batchRes.ok && Array.isArray(batchRes.data)) {
        batchStudents = batchRes.data;
      }
    }

    // Helper function to check if a raw submission item matches a student
    const isStudentMatch = (item: any, student: Student, totalBatchCount: number, totalSubmissionsCount: number, studentIndex: number) => {
      if (!item || !student) return false;

      // 1. Direct ID matching (student.id, student.userId, student.user_id, user.id, etc.)
      const itemStudentId = item.student?.id || item.studentId || item.student_id || item.userId || item.user_id || (typeof item.student === "string" ? item.student : null);
      const studentUserId = (student as any).userId || (student as any).user_id || (student as any).user?.id;
      if (itemStudentId && student.id && String(itemStudentId).trim() === String(student.id).trim()) return true;
      if (itemStudentId && studentUserId && String(itemStudentId).trim() === String(studentUserId).trim()) return true;

      // 2. Student code matching
      const itemCode = item.student?.studentCode || item.studentCode || item.code;
      if (itemCode && student.studentCode && String(itemCode).trim() === String(student.studentCode).trim()) return true;

      // 3. Name matching (exact or substring)
      const itemName = (item.student?.name || item.studentName || item.name || item.student?.user?.name || item.user?.name || "").trim().toLowerCase();
      const sName = (student.name || (student as any).user?.name || "").trim().toLowerCase();
      if (itemName && sName && (itemName === sName || itemName.includes(sName) || sName.includes(itemName))) return true;

      // 4. Index-based match fallback if submission count equals batch student count or if single student
      if (totalBatchCount === 1 || (totalSubmissionsCount === totalBatchCount && totalSubmissionsCount > 0)) return true;

      // 5. Fallback: if rawResults has only 1 submission item and it hasn't been matched yet
      if (totalSubmissionsCount === 1) return true;

      return false;
    };

    // Track which rawResult items were matched
    const matchedRawItemIndexes = new Set<number>();

    // Build complete roster by iterating through batchStudents
    let combinedResults: any[] = [];

    if (batchStudents.length > 0) {
      let targetStudents = batchStudents;
      if (homework?.targetType === "SPECIFIC" && Array.isArray(homework?.studentIds) && homework.studentIds.length > 0) {
        targetStudents = batchStudents.filter((s) => homework.studentIds.includes(s.id));
      }

      combinedResults = targetStudents.map((student, studentIndex) => {
        // Find matching submission in rawResults
        const existingIdx = rawResults.findIndex(
          (item: any, idx: number) => !matchedRawItemIndexes.has(idx) && isStudentMatch(item, student, targetStudents.length, rawResults.length, studentIndex)
        );
        
        if (existingIdx !== -1) {
          matchedRawItemIndexes.add(existingIdx);
          const existing = rawResults[existingIdx];

          const existingStatus = String(existing.status || "").toUpperCase();
          const isSubmittedOrGraded = 
            existingStatus === "SUBMITTED" || 
            existingStatus === "GRADED" || 
            existingStatus === "PENDING" || 
            existingStatus === "PENDING_GRADE" ||
            Boolean(existing.submissionId) ||
            Boolean(existing.submission?.id) ||
            Boolean(existing.submittedAt || existing.submitted_at || existing.createdAt) ||
            Boolean(existing.note) ||
            (Array.isArray(existing.attachments) && existing.attachments.length > 0) ||
            (existing.score !== null && existing.score !== undefined);

          if (isSubmittedOrGraded) {
            const submissionId = existing.submissionId ?? existing.submission?.id ?? existing.id ?? `sub_${student.id}`;
            const status = existingStatus && existingStatus !== "NOT_SUBMITTED" ? existingStatus : "SUBMITTED";
            const isLate = existing.isLate ?? existing.is_late ?? false;
            const isOverdue = existing.isOverdue ?? existing.is_overdue ?? false;
            
            let chip = existing.chip;
            if (!chip) {
              if (status === "GRADED") chip = isLate ? "GRADED_LATE" : "GRADED";
              else chip = isLate ? "SUBMITTED_LATE" : "SUBMITTED";
            }

            return {
              ...existing,
              assignmentId: existing.assignmentId || existing.id || student.id,
              submissionId,
              student: {
                id: student.id,
                name: existing.student?.name || student.name,
                studentCode: existing.student?.studentCode || student.studentCode,
              },
              status,
              chip,
              submittedAt: existing.submittedAt || existing.submitted_at || existing.createdAt || new Date().toISOString(),
              score: existing.score ?? existing.grade ?? null,
            };
          }
        }

        // Student has not submitted yet
        const dueDate = homework?.dueDate;
        const isOverdue = dueDate ? new Date() > new Date(dueDate) : false;

        return {
          assignmentId: `asg_${student.id}`,
          submissionId: null,
          student: {
            id: student.id,
            name: student.name,
            studentCode: student.studentCode,
          },
          status: "NOT_SUBMITTED",
          chip: isOverdue ? "OVERDUE" : "NOT_SUBMITTED",
          submittedAt: null,
          score: null,
        };
      });
    } else {
      // Fallback to rawResults mapping if batchStudents not available
      combinedResults = rawResults.map((item: any) => {
        const studentName = item.student?.name || item.studentName || item.name || item.student?.user?.name || "Student";
        const studentCode = item.student?.studentCode || item.studentCode || item.code || "";
        const studentId = item.student?.id || item.studentId || item.id;
        const submissionId = item.submissionId ?? item.submission?.id ?? (item.status && item.status !== "NOT_SUBMITTED" ? item.id : null);
        const status = item.status && item.status !== "NOT_SUBMITTED" ? item.status : (submissionId ? "SUBMITTED" : "NOT_SUBMITTED");
        const isLate = item.isLate ?? item.is_late ?? false;
        const isOverdue = item.isOverdue ?? item.is_overdue ?? false;
        
        let chip = item.chip;
        if (!chip) {
          if (status === "GRADED") chip = isLate ? "GRADED_LATE" : "GRADED";
          else if (status === "SUBMITTED") chip = isLate ? "SUBMITTED_LATE" : "SUBMITTED";
          else chip = isOverdue ? "OVERDUE" : "NOT_SUBMITTED";
        }

        return {
          ...item,
          assignmentId: item.assignmentId || item.id || studentId,
          submissionId,
          student: {
            id: studentId,
            name: studentName,
            studentCode,
          },
          status,
          chip,
          submittedAt: item.submittedAt || item.submitted_at || item.createdAt || null,
          score: item.score ?? item.grade ?? null,
        };
      });
    }

    // Include any remaining submissions in rawResults that didn't match batchStudents
    rawResults.forEach((item: any, idx: number) => {
      if (!matchedRawItemIndexes.has(idx)) {
        const studentName = item.student?.name || item.studentName || item.name || item.student?.user?.name || "Student";
        const studentCode = item.student?.studentCode || item.studentCode || item.code || "";
        const studentId = item.student?.id || item.studentId || item.id || `stu_${idx}`;
        const submissionId = item.submissionId ?? item.submission?.id ?? item.id;
        const status = item.status && item.status !== "NOT_SUBMITTED" ? item.status : (submissionId ? "SUBMITTED" : "NOT_SUBMITTED");
        const isLate = item.isLate ?? item.is_late ?? false;
        const isOverdue = item.isOverdue ?? item.is_overdue ?? false;

        let chip = item.chip;
        if (!chip) {
          if (status === "GRADED") chip = isLate ? "GRADED_LATE" : "GRADED";
          else if (status === "SUBMITTED") chip = isLate ? "SUBMITTED_LATE" : "SUBMITTED";
          else chip = isOverdue ? "OVERDUE" : "NOT_SUBMITTED";
        }

        combinedResults.push({
          ...item,
          assignmentId: item.assignmentId || item.id || studentId,
          submissionId,
          student: {
            id: studentId,
            name: studentName,
            studentCode,
          },
          status,
          chip,
          submittedAt: item.submittedAt || item.submitted_at || item.createdAt || null,
          score: item.score ?? item.grade ?? null,
        });
      }
    });

    // Apply client filters if requested
    if (filters?.status) {
      combinedResults = combinedResults.filter((r) => r.status === filters.status);
    }
    if (filters?.track) {
      if (filters.track === "ON_TIME") {
        combinedResults = combinedResults.filter((r) => !r.chip?.includes("LATE") && r.status !== "NOT_SUBMITTED");
      } else if (filters.track === "NOT_SUBMITTED") {
        combinedResults = combinedResults.filter((r) => r.status === "NOT_SUBMITTED");
      }
    }

    const summary = rawPayload.summary ?? rawPayload.data?.summary ?? {
      totalAssigned: combinedResults.length,
      submitted: combinedResults.filter((r) => r.submissionId || r.status === "SUBMITTED" || r.status === "GRADED").length,
      graded: combinedResults.filter((r) => r.status === "GRADED").length,
      late: combinedResults.filter((r) => r.chip === "SUBMITTED_LATE" || r.chip === "GRADED_LATE").length,
      notSubmitted: combinedResults.filter((r) => r.status === "NOT_SUBMITTED").length,
    };

    const meta = rawPayload.meta ?? rawPayload.data?.meta ?? {
      page: filters?.page || 1,
      limit: filters?.limit || 50,
      total: combinedResults.length,
      totalPages: 1,
    };

    return {
      ok: true,
      data: { homework: homework || detailData, summary, results: combinedResults },
      message: rawPayload.message,
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

    const payload = unwrap<any>(res.data) || {};
    let homework = payload.homework;
    if (!homework && (payload.id || payload.title)) {
      homework = payload;
    }
    if (!homework && payload.assignment?.homework) {
      homework = payload.assignment.homework;
    }

    const submission = payload.submission ?? null;
    const canSubmit = payload.canSubmit ?? true;
    const submitBlockedReason = payload.submitBlockedReason ?? null;

    return {
      ok: true,
      data: {
        homework,
        submission,
        canSubmit,
        submitBlockedReason,
      },
    };
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

    // Also update mock submission store for local testing fallback
    try {
      const { initialMockSubmissions } = require("@/data/mock-homework");
      if (initialMockSubmissions) {
        if (!initialMockSubmissions[homeworkId]) {
          initialMockSubmissions[homeworkId] = [];
        }
        const newSub: Submission = {
          id: `sub_${Date.now()}`,
          note: payload.note,
          submittedAt: new Date().toISOString(),
          isLate: false,
          status: "SUBMITTED",
          score: null,
          feedback: null,
          gradedAt: null,
          attachments: payload.attachments.map((att, i) => ({
            id: `att_${Date.now()}_${i}`,
            type: att.type,
            url: att.url,
            youtubeVideoId: att.type === "YOUTUBE" ? att.url : null,
            fileName: att.fileName,
            order: i + 1,
          })),
        };
        initialMockSubmissions[homeworkId].push(newSub);
      }
    } catch (e) {
      // Ignore if mock file not used
    }

    if (!res.success) {
      return { ok: false, error: res.message || "Failed to submit homework" };
    }

    revalidatePath("/dashboard/student/homework");
    revalidatePath(`/dashboard/student/homework/${homeworkId}`);
    revalidatePath("/dashboard/teacher/homework");
    revalidatePath(`/dashboard/teacher/homework/${homeworkId}/submissions`);
    revalidatePath("/dashboard/parent/homework");
    revalidatePath("/dashboard/parent/children");
    revalidatePath("/dashboard/student");
    revalidatePath("/dashboard/parent");
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
  results: Array<{
    assignmentId?: string;
    id?: string;
    student?: any;
    studentId?: string;
    studentCode?: string;
    studentName?: string;
    childId?: string;
    homework?: Homework;
    title?: string;
    instruction?: string;
    dueDate?: string;
    maxScore?: number | null;
    batchName?: string;
    teacherName?: string;
    status?: any;
    submittedAt?: string | null;
    isLate?: boolean;
    score?: number | null;
    feedback?: string | null;
    chip?: any;
    [key: string]: any;
  }>;
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

    let rawPayload = res.success ? (unwrap<any>(res.data) || {}) : {};
    let rawChildren = unwrapList<any>(
      rawPayload.children ?? rawPayload.students ?? rawPayload.data?.children ?? rawPayload.myChildren
    );

    // If children is empty, try fetching from parent children endpoint
    if (rawChildren.length === 0) {
      const childrenRes = await universalApi<any>({ endpoint: "/parents/my-children", method: "GET" });
      if (childrenRes.success) {
        rawChildren = unwrapList<any>(childrenRes.data);
      }
    }

    const children: Student[] = rawChildren.map((c: any) => {
      const s = c.student || c.user || c;
      return {
        id: s.id || c.id || "child_01",
        name: s.name || s.user?.name || c.name || c.studentName || "Student",
        studentCode: s.studentCode || s.code || c.studentCode || c.code || "",
      };
    });

    let results = unwrapList<any>(
      rawPayload.results ?? rawPayload.homeworks ?? rawPayload.assignments ?? rawPayload.data?.results ?? rawPayload.data?.homeworks ?? rawPayload.data
    );

    // Always fetch student homeworks to ensure ALL assigned homeworks (e.g. all 3 records) are included
    const studentHwsRes = await getStudentHomeworks();
    const studentHws = studentHwsRes.ok && Array.isArray(studentHwsRes.data) ? studentHwsRes.data : [];

    const existingHwIds = new Set<string>();
    results.forEach((r: any) => {
      const id = r.assignmentId || r.homework?.id || r.homeworkId || r.id;
      if (id) existingHwIds.add(String(id));
    });

    studentHws.forEach((stHw: any) => {
      const stId = stHw.assignmentId || stHw.homework?.id || stHw.id;
      if (stId && !existingHwIds.has(String(stId))) {
        existingHwIds.add(String(stId));
        results.push(stHw);
      }
    });

    // Enrich items in results with full homework details if missing title/instruction
    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      const hwObj = item?.homework && typeof item.homework === "object" ? item.homework : null;
      const hwId = hwObj?.id || (typeof item?.homework === "string" ? item.homework : null) || item?.homeworkId || item?.id;
      
      let title = hwObj?.title || item?.title || item?.name;
      let instruction = hwObj?.instruction || item?.instruction || item?.description;
      let dueDate = hwObj?.dueDate || item?.dueDate || item?.due_date;
      let maxScore = hwObj?.maxScore ?? item?.maxScore ?? item?.max_score;
      let batchName = hwObj?.batch?.name || item?.batchName || item?.batch?.name;
      let teacherName = hwObj?.teacher?.name || item?.teacherName || item?.teacher?.name;
      let status = item?.status || hwObj?.status;
      let score = item?.score ?? hwObj?.score;
      let feedback = item?.feedback ?? hwObj?.feedback;

      // Fetch via student endpoint (accessible to Parent) if detailed title/instruction/dueDate are missing
      if (hwId && (!title || title === "Homework" || !instruction || !dueDate)) {
        const detailRes = await getStudentHomeworkDetail(hwId);
        if (detailRes.ok && detailRes.data) {
          const detailHw = detailRes.data.homework || detailRes.data;
          const detailSub = detailRes.data.submission;

          title = detailHw?.title || title;
          instruction = detailHw?.instruction || instruction;
          dueDate = detailHw?.dueDate || dueDate;
          maxScore = detailHw?.maxScore ?? maxScore;
          batchName = detailHw?.batch?.name || batchName;
          teacherName = detailHw?.teacher?.name || teacherName;
          if (detailSub) {
            status = detailSub.status || status;
            score = detailSub.score ?? score;
            feedback = detailSub.feedback ?? feedback;
          }
        }
      }

      results[i] = {
        ...item,
        homework: item.homework || { title, instruction, dueDate, maxScore, batch: { name: batchName }, teacher: { name: teacherName } },
        title,
        instruction,
        dueDate,
        maxScore,
        batchName,
        teacherName,
        status,
        score,
        feedback,
      };
    }

    return {
      ok: true,
      data: { children, results },
      meta: rawPayload.meta ?? rawPayload.data?.meta,
      message: rawPayload.message,
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
