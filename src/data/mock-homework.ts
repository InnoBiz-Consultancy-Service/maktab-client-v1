import { Homework, Submission, Batch, Lesson, Student, Teacher } from "@/types/shared/homework";

export const mockTeacher: Teacher = {
  id: "tch_01",
  name: "Maulana Abdul Karim",
};

export const mockBatches: Batch[] = [
  { id: "batch_01", name: "Hifz Section — Class One" },
  { id: "batch_02", name: "Arabic Language — Level Two" },
];

export const mockLessons: Lesson[] = [
  { id: "lesson_01", title: "Surah Al-Fatiha — Tafsir", youtubeVideoId: "jNQXAC9IVRw" },
  { id: "lesson_02", title: "Tajweed Basics — Makhraj", youtubeVideoId: "dQw4w9WgXcQ" },
];

export const mockStudents: Student[] = [
  { id: "stu_01", name: "Rahim Uddin", studentCode: "STU-2026-001" },
  { id: "stu_02", name: "Karim Mia", studentCode: "STU-2026-002" },
  { id: "stu_03", name: "Zahid Hasan", studentCode: "STU-2026-003" },
  { id: "stu_05", name: "Salma Khatun", studentCode: "STU-2026-005" },
  { id: "stu_07", name: "Salim Ahmed", studentCode: "STU-2026-007" },
];

export const initialMockHomeworks: Homework[] = [
  {
    id: "hw_01",
    title: "Surah Al-Fatiha — memorise and write",
    instruction: "Memorise Surah Al-Fatiha, write it in your notebook, photograph the page and submit it. Also upload a recitation video to YouTube as Unlisted and paste the link.",
    batch: mockBatches[0],
    teacher: mockTeacher,
    lesson: mockLessons[0],
    assignedDate: "2026-07-20",
    dueDate: "2026-07-25",
    status: "PUBLISHED",
    maxScore: 10,
    allowLateSubmission: true,
    targetType: "BATCH",
    totalAssigned: 5,
  },
  {
    id: "hw_02",
    title: "Tajweed practice — video submission",
    instruction: "Upload a practice video demonstrating proper tajweed rules as learned in lesson 2.",
    batch: mockBatches[0],
    teacher: mockTeacher,
    lesson: mockLessons[1],
    assignedDate: "2026-07-22",
    dueDate: "2026-07-28",
    status: "DRAFT",
    maxScore: null,
    allowLateSubmission: false,
    targetType: "SPECIFIC",
    totalAssigned: 2,
  },
  {
    id: "hw_03",
    title: "Memorise the daily duas",
    instruction: "Memorise the morning and evening duas. No written submission needed, just complete tracking.",
    batch: mockBatches[1],
    teacher: mockTeacher,
    lesson: null,
    assignedDate: "2026-07-23",
    dueDate: "2026-07-24",
    status: "PUBLISHED",
    maxScore: null,
    allowLateSubmission: false,
    targetType: "BATCH",
    totalAssigned: 5,
  },
];

export const initialMockSubmissions: Record<string, Submission[]> = {
  hw_01: [
    {
      id: "sub_01",
      note: "I have memorised Surah Al-Fatiha and written it in my notebook. Recitation video attached.",
      submittedAt: "2026-07-23T14:20:00.000Z",
      isLate: false,
      status: "GRADED",
      score: 9,
      feedback: "Handwriting is neat. Pay a little more attention to makhraj in your recitation.",
      gradedAt: "2026-07-24T10:00:00.000Z",
      attachments: [
        {
          id: "att_01",
          type: "IMAGE",
          url: "https://cdn.example.com/uploads/homework/rahim-page1.jpg",
          youtubeVideoId: null,
          fileName: "page1.jpg",
          order: 1,
        },
        {
          id: "att_02",
          type: "YOUTUBE",
          url: "https://youtu.be/dQw4w9WgXcQ",
          youtubeVideoId: "dQw4w9WgXcQ",
          fileName: null,
          order: 2,
        },
        {
          id: "att_03",
          type: "PDF",
          url: "https://cdn.example.com/uploads/homework/rahim-notes.pdf",
          youtubeVideoId: null,
          fileName: "rahim-notes.pdf",
          order: 3,
        },
      ],
    },
    {
      id: "sub_02",
      note: "Here is my submission brother",
      submittedAt: "2026-07-26T09:10:00.000Z", // Past due date of hw_01 (2026-07-25)
      isLate: true,
      status: "SUBMITTED",
      score: null,
      feedback: null,
      gradedAt: null,
      attachments: [
        {
          id: "att_04",
          type: "LINK",
          url: "https://quran.com/1",
          youtubeVideoId: null,
          fileName: null,
          order: 1,
        },
      ],
    },
  ],
  hw_02: [],
  hw_03: [],
};

// Maps homework assignment ID to Student IDs assigned to it (useful for targetType: SPECIFIC or rosters)
export const mockAssignmentRosters: Record<string, string[]> = {
  hw_01: ["stu_01", "stu_02", "stu_03", "stu_05", "stu_07"],
  hw_02: ["stu_01", "stu_07"],
  hw_03: ["stu_01", "stu_02", "stu_03", "stu_05", "stu_07"],
};
