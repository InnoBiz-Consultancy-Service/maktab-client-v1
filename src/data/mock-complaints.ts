import type {
  MemberComplaint,
  InstituteComplaint,
  ComplaintStatistics,
} from "@/types/shared/complaint";

export const initialMockMemberComplaints: MemberComplaint[] = [
  {
    id: "comp_m_001",
    report:
      "Student has been consistently disruptive in class, refusing to follow Quran recitation guidelines and missing homework assignments.",
    status: "PENDING",
    reportedRole: "STUDENT",
    reporter: {
      id: "tchr_101",
      name: "Maulana Abdul Karim",
      role: "TEACHER",
    },
    reported: {
      id: "stu_01",
      name: "Rahim Uddin",
      role: "STUDENT",
    },
    institute: {
      id: "inst_01",
      name: "Al-Azhar Model Institute",
    },
    createdAt: "2026-08-04T09:15:00Z",
    updatedAt: "2026-08-04T09:15:00Z",
  },
  {
    id: "comp_m_002",
    report:
      "Teacher arrived 30 minutes late for 3 consecutive lessons without prior notification or explanation.",
    status: "RESOLVED",
    reportedRole: "TEACHER",
    reporter: {
      id: "prnt_201",
      name: "Tariq Mahmood",
      role: "PARENT",
    },
    reported: {
      id: "tchr_102",
      name: "Ustadh Mahmud Ali",
      role: "TEACHER",
    },
    institute: {
      id: "inst_01",
      name: "Al-Azhar Model Institute",
    },
    createdAt: "2026-08-03T14:20:00Z",
    updatedAt: "2026-08-04T11:00:00Z",
  },
  {
    id: "comp_m_003",
    report:
      "Parent used inappropriate language during parent-teacher conference regarding grading evaluation.",
    status: "PENDING",
    reportedRole: "PARENT",
    reporter: {
      id: "tchr_103",
      name: "Ustadha Fatima Khan",
      role: "TEACHER",
    },
    reported: {
      id: "prnt_202",
      name: "Salim Hossain",
      role: "PARENT",
    },
    institute: {
      id: "inst_01",
      name: "Al-Azhar Model Institute",
    },
    createdAt: "2026-08-02T16:45:00Z",
    updatedAt: "2026-08-02T16:45:00Z",
  },
  {
    id: "comp_m_004",
    report:
      "Student frequently forgets Tajweed textbook and does not complete assigned memorization tasks.",
    status: "PENDING",
    reportedRole: "STUDENT",
    reporter: {
      id: "tchr_101",
      name: "Maulana Abdul Karim",
      role: "TEACHER",
    },
    reported: {
      id: "stu_02",
      name: "Karim Mia",
      role: "STUDENT",
    },
    institute: {
      id: "inst_01",
      name: "Al-Azhar Model Institute",
    },
    createdAt: "2026-08-01T11:30:00Z",
    updatedAt: "2026-08-01T11:30:00Z",
  },
  {
    id: "comp_m_005",
    report:
      "Teacher did not provide marks or feedback for homework submitted two weeks ago.",
    status: "RESOLVED",
    reportedRole: "TEACHER",
    reporter: {
      id: "prnt_203",
      name: "Rafiqul Islam",
      role: "PARENT",
    },
    reported: {
      id: "tchr_101",
      name: "Maulana Abdul Karim",
      role: "TEACHER",
    },
    institute: {
      id: "inst_01",
      name: "Al-Azhar Model Institute",
    },
    createdAt: "2026-07-29T10:00:00Z",
    updatedAt: "2026-07-31T15:30:00Z",
  },
  {
    id: "comp_m_006",
    report:
      "Student engages in side conversations during live video lectures, distracting other classmates.",
    status: "PENDING",
    reportedRole: "STUDENT",
    reporter: {
      id: "tchr_102",
      name: "Ustadh Mahmud Ali",
      role: "TEACHER",
    },
    reported: {
      id: "stu_03",
      name: "Zahid Hasan",
      role: "STUDENT",
    },
    institute: {
      id: "inst_01",
      name: "Al-Azhar Model Institute",
    },
    createdAt: "2026-07-28T09:00:00Z",
    updatedAt: "2026-07-28T09:00:00Z",
  },
];

export const initialMockInstituteComplaints: InstituteComplaint[] = [
  {
    id: "comp_i_001",
    report:
      "The institute classroom air conditioning and sound system have been faulty for two weeks despite repeated notices.",
    status: "PENDING",
    reporter: {
      id: "tchr_101",
      name: "Maulana Abdul Karim",
      role: "TEACHER",
    },
    institute: {
      id: "inst_01",
      name: "Al-Azhar Model Institute",
    },
    createdAt: "2026-08-03T11:00:00Z",
    updatedAt: "2026-08-03T11:00:00Z",
  },
  {
    id: "comp_i_002",
    report:
      "Unreasonable delay in issuing official attendance certificate and course completion record.",
    status: "RESOLVED",
    reporter: {
      id: "prnt_201",
      name: "Tariq Mahmood",
      role: "PARENT",
    },
    institute: {
      id: "inst_01",
      name: "Al-Azhar Model Institute",
    },
    createdAt: "2026-07-26T16:20:00Z",
    updatedAt: "2026-07-29T12:00:00Z",
  },
  {
    id: "comp_i_003",
    report:
      "Institute management rescheduled weekend Hifz classes without 24-hour advance notice to parents.",
    status: "PENDING",
    reporter: {
      id: "prnt_203",
      name: "Rafiqul Islam",
      role: "PARENT",
    },
    institute: {
      id: "inst_01",
      name: "Al-Azhar Model Institute",
    },
    createdAt: "2026-08-02T14:10:00Z",
    updatedAt: "2026-08-02T14:10:00Z",
  },
];

export const initialMockStatistics: ComplaintStatistics = {
  totalMemberComplaints: 6,
  totalInstituteComplaints: 3,
  pendingMemberComplaints: 4,
  pendingInstituteComplaints: 2,
  resolvedMemberComplaints: 2,
  resolvedInstituteComplaints: 1,
};
