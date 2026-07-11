/**
 * ⚠️ PLACEHOLDER DATA — the student learning APIs don't exist yet.
 * Each export names the endpoint that should replace it.
 *
 * The whole point of this area: a child should feel like they're playing, not
 * studying. Streaks, XP, ranks and unlockable modules do that work.
 */

export type SubjectKey = "quran" | "arabic" | "studies" | "duas";

export interface Subject {
  key: SubjectKey;
  label: string;
  /** Tailwind classes: soft background + accent text. */
  soft: string;
  accent: string;
  /** Solid colour class for meters. */
  solid: string;
}

export const subjects: Record<SubjectKey, Subject> = {
  quran: {
    key: "quran",
    label: "Quran",
    soft: "bg-quran-soft",
    accent: "text-quran",
    solid: "bg-quran",
  },
  arabic: {
    key: "arabic",
    label: "Arabic",
    soft: "bg-arabic-soft",
    accent: "text-arabic",
    solid: "bg-arabic",
  },
  studies: {
    key: "studies",
    label: "Islamic studies",
    soft: "bg-studies-soft",
    accent: "text-studies",
    solid: "bg-studies",
  },
  duas: {
    key: "duas",
    label: "Duas",
    soft: "bg-duas-soft",
    accent: "text-duas",
    solid: "bg-duas",
  },
};

/** Positively framed ranks — never a substitute for real ijazah. */
export interface Rank {
  id: string;
  title: string;
  minXp: number;
}

export const ranks: Rank[] = [
  { id: "new-talib", title: "New Talib", minXp: 0 },
  { id: "eager-learner", title: "Eager Learner", minXp: 100 },
  { id: "devoted-student", title: "Devoted Student", minXp: 300 },
  { id: "knowledge-seeker", title: "Knowledge Seeker", minXp: 600 },
  { id: "rising-scholar", title: "Rising Scholar", minXp: 1000 },
  { id: "maktab-star", title: "Maktab Star", minXp: 1500 },
];

export function rankForXp(xp: number): {
  current: Rank;
  next: Rank | null;
  progress: number;
} {
  let current = ranks[0];
  for (const r of ranks) if (xp >= r.minXp) current = r;

  const idx = ranks.findIndex((r) => r.id === current.id);
  const next = idx < ranks.length - 1 ? ranks[idx + 1] : null;

  const progress = next
    ? Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100)
    : 100;

  return { current, next, progress };
}

export type LessonState = "locked" | "available" | "done";

export interface Lesson {
  id: string;
  title: string;
  subject: SubjectKey;
  /** Minutes. */
  duration: number;
  xp: number;
  state: LessonState;
  hasQuiz: boolean;
  /** Placeholder video source. */
  videoUrl: string;
  description: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  /** Lucide icon name we map on the client. */
  icon: "flame" | "star" | "trophy" | "book" | "moon" | "sparkles";
}

export interface StudentProfile {
  name: string;
  studentCode: string;
  xp: number;
  /** Consecutive days with at least one lesson. */
  streak: number;
  /** Lessons completed today vs the daily goal. */
  todayDone: number;
  dailyGoal: number;
}

/** TODO: replace with GET /api/v1/students/me */
export const dummyProfile: StudentProfile = {
  name: "Abdullah",
  studentCode: "104829",
  xp: 420,
  streak: 6,
  todayDone: 1,
  dailyGoal: 3,
};

/** TODO: replace with GET /api/v1/students/lessons */
export const dummyLessons: Lesson[] = [
  {
    id: "l1",
    title: "Surah Al-Fatiha",
    subject: "quran",
    duration: 6,
    xp: 30,
    state: "done",
    hasQuiz: true,
    videoUrl: "",
    description: "Learn the opening chapter, verse by verse.",
  },
  {
    id: "l2",
    title: "The letter Alif",
    subject: "arabic",
    duration: 4,
    xp: 20,
    state: "done",
    hasQuiz: true,
    videoUrl: "",
    description: "Meet the first letter of the Arabic alphabet.",
  },
  {
    id: "l3",
    title: "Dua before eating",
    subject: "duas",
    duration: 3,
    xp: 20,
    state: "available",
    hasQuiz: true,
    videoUrl: "",
    description: "A short dua to say before every meal.",
  },
  {
    id: "l4",
    title: "The letter Ba",
    subject: "arabic",
    duration: 4,
    xp: 20,
    state: "available",
    hasQuiz: true,
    videoUrl: "",
    description: "The second letter, and how it joins.",
  },
  {
    id: "l5",
    title: "Surah Al-Ikhlas",
    subject: "quran",
    duration: 7,
    xp: 35,
    state: "locked",
    hasQuiz: true,
    videoUrl: "",
    description: "A short surah about the oneness of Allah.",
  },
  {
    id: "l6",
    title: "The five pillars",
    subject: "studies",
    duration: 8,
    xp: 40,
    state: "locked",
    hasQuiz: true,
    videoUrl: "",
    description: "The foundations every Muslim builds upon.",
  },
];

/** TODO: replace with GET /api/v1/students/badges */
export const dummyBadges: Badge[] = [
  {
    id: "b1",
    title: "First steps",
    description: "Finished your first lesson",
    earned: true,
    icon: "star",
  },
  {
    id: "b2",
    title: "On fire",
    description: "5-day streak",
    earned: true,
    icon: "flame",
  },
  {
    id: "b3",
    title: "Bookworm",
    description: "Complete 10 lessons",
    earned: false,
    icon: "book",
  },
  {
    id: "b4",
    title: "Night owl",
    description: "Study after Isha",
    earned: true,
    icon: "moon",
  },
  {
    id: "b5",
    title: "Perfect score",
    description: "Get 100% on a quiz",
    earned: false,
    icon: "trophy",
  },
  {
    id: "b6",
    title: "Rising star",
    description: "Reach 1000 XP",
    earned: false,
    icon: "sparkles",
  },
];

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

/** TODO: replace with GET /api/v1/lessons/:id/quiz */
export const dummyQuiz: QuizQuestion[] = [
  {
    id: "q1",
    question: "How many verses are in Surah Al-Fatiha?",
    options: ["5", "7", "9", "11"],
    correctIndex: 1,
  },
  {
    id: "q2",
    question: "What does “Al-Fatiha” mean?",
    options: ["The Light", "The Opening", "The Cave", "The Dawn"],
    correctIndex: 1,
  },
  {
    id: "q3",
    question: "When do we recite Surah Al-Fatiha?",
    options: [
      "Only on Fridays",
      "Once a year",
      "In every rak'ah of salah",
      "Never",
    ],
    correctIndex: 2,
  },
];
