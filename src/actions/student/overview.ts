"use server";

import {
  dummyProfile,
  dummyLessons,
  dummyBadges,
  rankForXp,
  type StudentProfile,
  type Lesson,
  type Badge,
  type Rank,
} from "@/lib/dummy/student";
import type { ActionResult } from "@/types/shared";

export interface StudentOverview {
  profile: StudentProfile;
  rank: { current: Rank; next: Rank | null; progress: number };
  lessons: Lesson[];
  badges: Badge[];
  /** The next lesson they can actually start. */
  nextLesson: Lesson | null;
  counts: {
    completed: number;
    total: number;
    badgesEarned: number;
  };
}

/**
 * ⚠️ PLACEHOLDER — shaped like a real action so swapping in the API later only
 * changes this function body.
 */
export async function getStudentOverviewAction(): Promise<
  ActionResult<StudentOverview>
> {
  const profile = dummyProfile;
  const lessons = dummyLessons;
  const badges = dummyBadges;

  return {
    ok: true,
    data: {
      profile,
      rank: rankForXp(profile.xp),
      lessons,
      badges,
      nextLesson: lessons.find((l) => l.state === "available") ?? null,
      counts: {
        completed: lessons.filter((l) => l.state === "done").length,
        total: lessons.length,
        badgesEarned: badges.filter((b) => b.earned).length,
      },
    },
  };
}
