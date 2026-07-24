import type { Role } from "@/types/shared";

export type NavIconName =
  | "home"
  | "students"
  | "teachers"
  | "parents"
  | "attendance"
  | "marks"
  | "settings"
  | "institutes"
  | "content"
  | "children"
  | "payments"
  | "messages"
  | "learn"
  | "progress"
  | "batches"
  | "homework";

export interface NavItem {
  href: string;
  label: string;
  icon: NavIconName;
  /** Shown in the mobile bottom bar. Keep to four per role — big tap targets. */
  mobile?: boolean;
}

export interface RoleNav {
  /** The role's home page — used for active-state and redirects. */
  indexHref: string;
  items: NavItem[];
}

// ---- ADMIN — runs the whole platform ----
const adminNav: RoleNav = {
  indexHref: "/dashboard/admin",
  items: [
    { href: "/dashboard/admin", label: "Home", icon: "home", mobile: true },
    {
      href: "/dashboard/admin/institutes",
      label: "Institutes",
      icon: "institutes",
      mobile: true,
    },
    {
      href: "/dashboard/admin/content",
      label: "Content",
      icon: "content",
      mobile: true,
    },
    {
      href: "/dashboard/admin/settings",
      label: "Settings",
      icon: "settings",
      mobile: true,
    },
  ],
};

// ---- INSTITUTE — manages its own teachers, students, parents ----
const instituteNav: RoleNav = {
  indexHref: "/dashboard/institute",
  items: [
    { href: "/dashboard/institute", label: "Home", icon: "home", mobile: true },
    {
      href: "/dashboard/institute/students",
      label: "Students",
      icon: "students",
      mobile: true,
    },
    {
      href: "/dashboard/institute/teachers",
      label: "Teachers",
      icon: "teachers",
      mobile: true,
    },
    { href: "/dashboard/institute/parents", label: "Parents", icon: "parents" },
    {
      href: "/dashboard/institute/attendance",
      label: "Attendance",
      icon: "attendance",
    },
    {
      href: "/dashboard/institute/batches",
      label: "Batches",
      icon: "batches",
    },
    {
      href: "/dashboard/institute/settings",
      label: "Settings",
      icon: "settings",
      mobile: true,
    },
  ],
};

// ---- TEACHER — only their own assigned students ----
const teacherNav: RoleNav = {
  indexHref: "/dashboard/teacher",
  items: [
    { href: "/dashboard/teacher", label: "Home", icon: "home", mobile: true },
    {
      href: "/dashboard/teacher/students",
      label: "My students",
      icon: "students",
      mobile: true,
    },
    {
      href: "/dashboard/teacher/attendance",
      label: "Attendance",
      icon: "attendance",
      mobile: true,
    },
    {
      href: "/dashboard/teacher/lessons",
      label: "Add lesson",
      icon: "attendance",
      mobile: true,
    },
    {
      href: "/dashboard/teacher/quizzes",
      label: "Add quiz",
      icon: "attendance",
      mobile: true,
    },
    {
      href: "/dashboard/teacher/homework",
      label: "Homework",
      icon: "homework",
      mobile: true,
    },
    { href: "/dashboard/teacher/marks", label: "Marks", icon: "marks" },
    {
      href: "/dashboard/teacher/settings",
      label: "Settings",
      icon: "settings",
      mobile: true,
    },
  ],
};

// ---- PARENT — follows their own children ----
const parentNav: RoleNav = {
  indexHref: "/dashboard/parent",
  items: [
    { href: "/dashboard/parent", label: "Home", icon: "home", mobile: true },
    {
      href: "/dashboard/parent/children",
      label: "Children",
      icon: "children",
      mobile: true,
    },
    {
      href: "/dashboard/parent/payments",
      label: "Payments",
      icon: "payments",
      mobile: true,
    },
    {
      href: "/dashboard/parent/homework",
      label: "Homework",
      icon: "homework",
      mobile: true,
    },
    { href: "/dashboard/parent/messages", label: "Messages", icon: "messages" },
    {
      href: "/dashboard/parent/settings",
      label: "Settings",
      icon: "settings",
      mobile: true,
    },
  ],
};

// ---- STUDENT — their own learning ----
const studentNav: RoleNav = {
  indexHref: "/dashboard/student",
  items: [
    { href: "/dashboard/student", label: "Home", icon: "home", mobile: true },
    {
      href: "/dashboard/student/learn",
      label: "Learn",
      icon: "learn",
      mobile: true,
    },
    {
      href: "/dashboard/student/progress",
      label: "Progress",
      icon: "progress",
      mobile: true,
    },
    {
      href: "/dashboard/student/homework",
      label: "Homework",
      icon: "homework",
      mobile: true,
    },
    {
      href: "/dashboard/student/settings",
      label: "Settings",
      icon: "settings",
      mobile: true,
    },
  ],
};

/** Nav for every role. The shell picks one from the session. */
export const navByRole: Record<Role, RoleNav> = {
  ADMIN: adminNav,
  INSTITUTE: instituteNav,
  TEACHER: teacherNav,
  PARENT: parentNav,
  STUDENT: studentNav,
};
