"use server";

import { Homework, Submission, Batch, Lesson, Student } from "@/types/shared/homework";
import {
  initialMockHomeworks,
  initialMockSubmissions,
  mockAssignmentRosters,
  mockBatches,
  mockLessons,
  mockStudents,
  mockTeacher,
} from "@/data/mock-homework";
import { ActionResult } from "@/types/shared";
import { revalidatePath } from "next/cache";

// Dev-mode HMR persistent storage
const globalForHomework = globalThis as unknown as {
  homeworks: Homework[];
  submissions: Record<string, Submission[]>;
  assignmentRosters: Record<string, string[]>;
};

if (!globalForHomework.homeworks) {
  globalForHomework.homeworks = JSON.parse(JSON.stringify(initialMockHomeworks));
}
if (!globalForHomework.submissions) {
  globalForHomework.submissions = JSON.parse(JSON.stringify(initialMockSubmissions));
}
if (!globalForHomework.assignmentRosters) {
  globalForHomework.assignmentRosters = JSON.parse(JSON.stringify(mockAssignmentRosters));
}

const homeworks = globalForHomework.homeworks;
const submissionsStore = globalForHomework.submissions;
const assignmentRosters = globalForHomework.assignmentRosters;

// Utility to generate unique ID
const genId = (prefix: string) => `${prefix}_${Math.random().toString(36).substring(2, 9)}`;

const isStudentSubmission = (subId: string, studId: string) => {
  if (studId === "stu_01" && subId === "sub_01") return true;
  if (studId === "stu_02" && subId === "sub_02") return true;
  return subId.startsWith(`sub_${studId}_`) || subId === `sub_${studId}`;
};

// =========================================================================
// TEACHER ACTIONS
// =========================================================================

export async function getTeacherHomeworks(filters?: {
  search?: string;
  status?: string;
  batchId?: string;
}): Promise<ActionResult<Homework[]>> {
  try {
    let list = [...homeworks];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((h) => h.title.toLowerCase().includes(q));
    }
    if (filters?.status) {
      list = list.filter((h) => h.status === filters.status);
    }
    if (filters?.batchId) {
      list = list.filter((h) => h.batch.id === filters.batchId);
    }

    return { ok: true, data: list };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch teacher homeworks" };
  }
}

export async function getHomeworkDetail(id: string): Promise<ActionResult<Homework & { studentIds?: string[] }>> {
  try {
    const hw = homeworks.find((h) => h.id === id);
    if (!hw) return { ok: false, error: "Homework not found" };

    const studentIds = assignmentRosters[id] || [];
    return { ok: true, data: { ...hw, studentIds } };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch homework details" };
  }
}

export async function getBatches(): Promise<ActionResult<Batch[]>> {
  return { ok: true, data: mockBatches };
}

export async function getLessons(): Promise<ActionResult<Lesson[]>> {
  return { ok: true, data: mockLessons };
}

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
    const batch = mockBatches.find((b) => b.id === data.batchId);
    if (!batch) return { ok: false, error: "Selected batch is invalid" };

    const lesson = data.lessonId ? mockLessons.find((l) => l.id === data.lessonId) || null : null;

    if (data.dueDate < data.assignedDate) {
      return { ok: false, error: "Due date cannot be before assigned date" };
    }

    const newHw: Homework = {
      id: genId("hw"),
      title: data.title,
      instruction: data.instruction,
      batch,
      teacher: mockTeacher,
      lesson,
      assignedDate: data.assignedDate,
      dueDate: data.dueDate,
      status: data.status,
      maxScore: data.maxScore,
      allowLateSubmission: data.allowLateSubmission,
      targetType: data.targetType,
      totalAssigned: data.targetType === "SPECIFIC" && data.studentIds ? data.studentIds.length : 5,
    };

    homeworks.push(newHw);
    submissionsStore[newHw.id] = [];
    assignmentRosters[newHw.id] = data.targetType === "SPECIFIC" && data.studentIds 
      ? data.studentIds 
      : mockStudents.map(s => s.id);

    revalidatePath("/dashboard/teacher/homework");
    return { ok: true, data: newHw };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to create homework" };
  }
}

export async function updateHomework(
  id: string,
  data: {
    title: string;
    instruction: string;
    lessonId: string | null;
    assignedDate: string;
    dueDate: string;
    status: "DRAFT" | "PUBLISHED";
    maxScore: number | null;
    allowLateSubmission: boolean;
    batchId?: string;
    targetType?: "BATCH" | "SPECIFIC";
    studentIds?: string[] | null;
  }
): Promise<ActionResult<Homework>> {
  try {
    const hwIdx = homeworks.findIndex((h) => h.id === id);
    if (hwIdx === -1) return { ok: false, error: "Homework not found" };

    const existingHw = homeworks[hwIdx];

    // Check if edits are locked due to student submissions
    const hasSubmissions = (submissionsStore[id] || []).length > 0;
    if (hasSubmissions) {
      if (data.batchId && data.batchId !== existingHw.batch.id) {
        return { ok: false, error: "Cannot change batch after students have submitted work" };
      }
      if (data.targetType && data.targetType !== existingHw.targetType) {
        return { ok: false, error: "Cannot change target audience after students have submitted work" };
      }
    }

    if (data.dueDate < data.assignedDate) {
      return { ok: false, error: "Due date cannot be before assigned date" };
    }

    const lesson = data.lessonId ? mockLessons.find((l) => l.id === data.lessonId) || null : null;

    if (data.batchId) {
      const batch = mockBatches.find((b) => b.id === data.batchId);
      if (batch) existingHw.batch = batch;
    }

    existingHw.title = data.title;
    existingHw.instruction = data.instruction;
    existingHw.lesson = lesson;
    existingHw.assignedDate = data.assignedDate;
    existingHw.dueDate = data.dueDate;
    existingHw.status = data.status;
    existingHw.maxScore = data.maxScore;
    existingHw.allowLateSubmission = data.allowLateSubmission;

    if (!hasSubmissions) {
      if (data.targetType) existingHw.targetType = data.targetType;
      if (data.targetType === "SPECIFIC" && data.studentIds) {
        assignmentRosters[id] = data.studentIds;
        existingHw.totalAssigned = data.studentIds.length;
      } else {
        assignmentRosters[id] = mockStudents.map(s => s.id);
        existingHw.totalAssigned = 5;
      }
    }

    revalidatePath("/dashboard/teacher/homework");
    revalidatePath(`/dashboard/teacher/homework/${id}`);
    return { ok: true, data: existingHw };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to update homework" };
  }
}

export async function deleteHomework(id: string): Promise<ActionResult<{ id: string; deletedSubmissions: number }>> {
  try {
    const hwIdx = homeworks.findIndex((h) => h.id === id);
    if (hwIdx === -1) return { ok: false, error: "Homework not found" };

    homeworks.splice(hwIdx, 1);
    const subs = submissionsStore[id] || [];
    const deletedCount = subs.length;
    delete submissionsStore[id];
    delete assignmentRosters[id];

    revalidatePath("/dashboard/teacher/homework");
    return { ok: true, data: { id, deletedSubmissions: deletedCount } };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to delete homework" };
  }
}

export interface HomeworkSubmissionSummary {
  homework: Homework;
  summary: {
    totalAssigned: number;
    submitted: number;
    graded: number;
    notSubmitted: number;
    late: number;
  };
  results: {
    assignmentId: string;
    student: Student;
    status: "NOT_SUBMITTED" | "SUBMITTED" | "GRADED";
    submissionId: string | null;
    submittedAt: string | null;
    isLate: boolean;
    score: number | null;
    attachmentCount: number;
  }[];
}

export async function getHomeworkSubmissions(homeworkId: string): Promise<ActionResult<HomeworkSubmissionSummary>> {
  try {
    const homework = homeworks.find((h) => h.id === homeworkId);
    if (!homework) return { ok: false, error: "Homework not found" };

    const assignedStudentIds = assignmentRosters[homeworkId] || [];
    const submissions = submissionsStore[homeworkId] || [];

    const results = assignedStudentIds.map((studentId) => {
      const student = mockStudents.find((s) => s.id === studentId)!;
      const submission = submissions.find((s) => isStudentSubmission(s.id, studentId));

      return {
        assignmentId: `asg_${homeworkId}_${studentId}`,
        student,
        status: submission ? submission.status : ("NOT_SUBMITTED" as const),
        submissionId: submission ? submission.id : null,
        submittedAt: submission ? submission.submittedAt : null,
        isLate: submission ? submission.isLate : false,
        score: submission ? submission.score : null,
        attachmentCount: submission ? submission.attachments.length : 0,
      };
    });

    const totalAssigned = assignedStudentIds.length;
    const submittedCount = results.filter((r) => r.status !== "NOT_SUBMITTED").length;
    const gradedCount = results.filter((r) => r.status === "GRADED").length;
    const notSubmittedCount = totalAssigned - submittedCount;
    const lateCount = results.filter((r) => r.isLate).length;

    return {
      ok: true,
      data: {
        homework,
        summary: {
          totalAssigned,
          submitted: submittedCount,
          graded: gradedCount,
          notSubmitted: notSubmittedCount,
          late: lateCount,
        },
        results,
      },
    };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch submissions roster" };
  }
}

export interface SubmissionDetails {
  id: string;
  student: Student;
  homework: Homework;
  note: string | null;
  submittedAt: string;
  isLate: boolean;
  status: "SUBMITTED" | "GRADED";
  score: number | null;
  feedback: string | null;
  gradedAt: string | null;
  attachments: {
    id: string;
    type: "IMAGE" | "PDF" | "YOUTUBE" | "LINK";
    url: string;
    youtubeVideoId: string | null;
    fileName: string | null;
    order: number;
  }[];
}

export async function getSubmissionDetails(submissionId: string): Promise<ActionResult<SubmissionDetails>> {
  try {
    let foundSub: Submission | undefined;
    let foundHwId: string | undefined;
    let foundStudentId: string | undefined;

    // Find submission in mock storage
    for (const [hwId, subs] of Object.entries(submissionsStore)) {
      const s = subs.find((sub) => sub.id === submissionId);
      if (s) {
        foundSub = s;
        foundHwId = hwId;
        // In this mock, we map sub_01 -> stu_01, sub_02 -> stu_02, and newly created submissions.
        if (submissionId === "sub_01") foundStudentId = "stu_01";
        else if (submissionId === "sub_02") foundStudentId = "stu_02";
        else if (submissionId.startsWith("sub_")) {
          const parts = submissionId.split("_");
          if (parts.length >= 3) {
            foundStudentId = parts.slice(1, -1).join("_");
          } else {
            foundStudentId = submissionId.replace("sub_", "");
          }
        }
        break;
      }
    }

    if (!foundSub || !foundHwId || !foundStudentId) {
      return { ok: false, error: "Submission not found" };
    }

    const homework = homeworks.find((h) => h.id === foundHwId)!;
    const student = mockStudents.find((s) => s.id === foundStudentId)!;

    return {
      ok: true,
      data: {
        id: foundSub.id,
        student,
        homework,
        note: foundSub.note,
        submittedAt: foundSub.submittedAt,
        isLate: foundSub.isLate,
        status: foundSub.status,
        score: foundSub.score,
        feedback: foundSub.feedback,
        gradedAt: foundSub.gradedAt,
        attachments: foundSub.attachments,
      },
    };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch submission details" };
  }
}

export async function gradeSubmission(
  submissionId: string,
  payload: {
    score: number | null;
    feedback: string | null;
    isCompleted?: boolean; // For maxScore === null
  }
): Promise<ActionResult<Submission>> {
  try {
    let foundSub: Submission | undefined;
    let hwId: string | undefined;

    for (const [hId, subs] of Object.entries(submissionsStore)) {
      const s = subs.find((sub) => sub.id === submissionId);
      if (s) {
        foundSub = s;
        hwId = hId;
        break;
      }
    }

    if (!foundSub || !hwId) return { ok: false, error: "Submission not found" };
    const hw = homeworks.find((h) => h.id === hwId)!;

    if (hw.maxScore !== null && payload.score !== null) {
      if (payload.score < 0 || payload.score > hw.maxScore) {
        return { ok: false, error: `Score must be between 0 and ${hw.maxScore}` };
      }
    }

    foundSub.status = "GRADED";
    foundSub.score = hw.maxScore === null ? (payload.isCompleted ? 1 : 0) : payload.score;
    foundSub.feedback = payload.feedback;
    foundSub.gradedAt = new Date().toISOString();

    revalidatePath("/dashboard/teacher/homework");
    revalidatePath(`/dashboard/teacher/homework/${hwId}/submissions`);
    revalidatePath(`/dashboard/teacher/homework/submissions/${submissionId}`);
    return { ok: true, data: foundSub };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to grade submission" };
  }
}

// =========================================================================
// STUDENT ACTIONS
// =========================================================================

export interface StudentHomeworkListItem {
  assignmentId: string;
  homework: Homework;
  status: "NOT_SUBMITTED" | "SUBMITTED" | "GRADED";
  submittedAt: string | null;
  isLate: boolean;
  score: number | null;
}

export async function getStudentHomeworks(studentId: string): Promise<ActionResult<StudentHomeworkListItem[]>> {
  try {
    // Only published homeworks are returned to students
    const published = homeworks.filter((h) => h.status === "PUBLISHED");
    const studentList: StudentHomeworkListItem[] = [];

    for (const hw of published) {
      const assignedStudents = assignmentRosters[hw.id] || [];
      if (!assignedStudents.includes(studentId)) continue;

      const subs = submissionsStore[hw.id] || [];
      const sub = subs.find((s) => isStudentSubmission(s.id, studentId));

      studentList.push({
        assignmentId: `asg_${hw.id}_${studentId}`,
        homework: hw,
        status: sub ? sub.status : "NOT_SUBMITTED",
        submittedAt: sub ? sub.submittedAt : null,
        isLate: sub ? sub.isLate : false,
        score: sub ? sub.score : null,
      });
    }

    return { ok: true, data: studentList };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch student homeworks" };
  }
}

export interface StudentHomeworkDetail {
  homework: Homework;
  canSubmit: boolean;
  submission: Submission | null;
}

export async function getStudentHomeworkDetail(
  studentId: string,
  homeworkId: string
): Promise<ActionResult<StudentHomeworkDetail>> {
  try {
    const hw = homeworks.find((h) => h.id === homeworkId);
    if (!hw || hw.status !== "PUBLISHED") return { ok: false, error: "Homework not found or unavailable" };

    const assigned = assignmentRosters[homeworkId] || [];
    if (!assigned.includes(studentId)) {
      return { ok: false, error: "This homework is not assigned to you" };
    }

    const subs = submissionsStore[homeworkId] || [];
    const sub = subs.find((s) => isStudentSubmission(s.id, studentId)) || null;

    // Derived rule: canSubmit
    // already has submission -> false
    // past due date and late submissions NOT allowed -> false
    // otherwise -> true
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const isPastDue = today > hw.dueDate;
    const canSubmit = !sub && (!isPastDue || hw.allowLateSubmission);

    return {
      ok: true,
      data: {
        homework: hw,
        canSubmit,
        submission: sub,
      },
    };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch homework detail" };
  }
}

export async function submitStudentHomework(
  studentId: string,
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
    const hw = homeworks.find((h) => h.id === homeworkId);
    if (!hw) return { ok: false, error: "Homework not found" };

    const assigned = assignmentRosters[homeworkId] || [];
    if (!assigned.includes(studentId)) return { ok: false, error: "Homework not assigned to you" };

    const subs = submissionsStore[homeworkId] || [];
    const existing = subs.some((s) => isStudentSubmission(s.id, studentId));
    if (existing) return { ok: false, error: "You have already submitted this assignment" };

    // Validation: At least note or one attachment
    if (!payload.note?.trim() && payload.attachments.length === 0) {
      return { ok: false, error: "Submission must contain a note or at least one attachment" };
    }

    if (payload.attachments.length > 10) {
      return { ok: false, error: "Maximum of 10 attachments allowed" };
    }

    const today = new Date().toISOString().split("T")[0];
    const isPastDue = today > hw.dueDate;
    if (isPastDue && !hw.allowLateSubmission) {
      return { ok: false, error: "Late submissions are not allowed for this homework" };
    }

    // Process attachments to parse YouTube videos
    const parsedAttachments = payload.attachments.map((att, idx) => {
      let youtubeVideoId: string | null = null;
      if (att.type === "YOUTUBE") {
        youtubeVideoId = parseYoutubeId(att.url);
        if (!youtubeVideoId || youtubeVideoId.length !== 11) {
          throw new Error("Invalid YouTube link format. Unable to parse video ID.");
        }
      }

      return {
        id: genId("att"),
        type: att.type,
        url: att.url,
        youtubeVideoId,
        fileName: att.fileName,
        order: idx + 1,
      };
    });

    const newSub: Submission = {
      id: `sub_${studentId}_${Date.now()}`,
      note: payload.note || null,
      attachments: parsedAttachments,
      submittedAt: new Date().toISOString(),
      isLate: isPastDue,
      status: "SUBMITTED",
      score: null,
      feedback: null,
      gradedAt: null,
    };

    submissionsStore[homeworkId].push(newSub);

    revalidatePath("/dashboard/student/homework");
    revalidatePath(`/dashboard/student/homework/${homeworkId}`);
    return { ok: true, data: newSub };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to submit homework" };
  }
}

// Helper function to parse YouTube link
function parseYoutubeId(url: string): string | null {
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  } catch {
    return null;
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
  }[];
}

export async function getParentHomeworkData(): Promise<ActionResult<ParentHomeworkData>> {
  try {
    // In our mock, the parent's children are stu_01 (Rahim Uddin) and stu_05 (Salma Khatun)
    const children = [mockStudents[0], mockStudents[3]];
    const results: ParentHomeworkData["results"] = [];

    const published = homeworks.filter((h) => h.status === "PUBLISHED");

    for (const child of children) {
      for (const hw of published) {
        const assigned = assignmentRosters[hw.id] || [];
        if (!assigned.includes(child.id)) continue;

        const subs = submissionsStore[hw.id] || [];
        const sub = subs.find((s) => isStudentSubmission(s.id, child.id));

        results.push({
          assignmentId: `asg_${hw.id}_${child.id}`,
          student: { id: child.id, name: child.name },
          homework: hw,
          status: sub ? sub.status : "NOT_SUBMITTED",
          submittedAt: sub ? sub.submittedAt : null,
          isLate: sub ? sub.isLate : false,
          score: sub ? sub.score : null,
          feedback: sub ? sub.feedback : null,
        });
      }
    }

    return {
      ok: true,
      data: {
        children,
        results,
      },
    };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to fetch parent homework dashboard" };
  }
}
