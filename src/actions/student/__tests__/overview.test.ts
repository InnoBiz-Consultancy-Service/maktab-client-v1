import { getStudentOverviewAction } from "@/actions/student/overview";
import {
  dummyProfile,
  dummyLessons,
  dummyBadges,
  rankForXp,
} from "@/lib/dummy/student";

describe("getStudentOverviewAction", () => {
  it("always succeeds and returns the profile, lessons, and badges as-is", async () => {
    const result = await getStudentOverviewAction();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.profile).toEqual(dummyProfile);
    expect(result.data.lessons).toEqual(dummyLessons);
    expect(result.data.badges).toEqual(dummyBadges);
  });

  it("computes rank from the profile's xp", async () => {
    const result = await getStudentOverviewAction();
    if (!result.ok) throw new Error("expected ok");
    expect(result.data.rank).toEqual(rankForXp(dummyProfile.xp));
  });

  it("picks the first available lesson as nextLesson", async () => {
    const result = await getStudentOverviewAction();
    if (!result.ok) throw new Error("expected ok");
    const expected = dummyLessons.find((l) => l.state === "available") ?? null;
    expect(result.data.nextLesson).toEqual(expected);
  });

  it("counts completed lessons, total lessons, and earned badges", async () => {
    const result = await getStudentOverviewAction();
    if (!result.ok) throw new Error("expected ok");
    expect(result.data.counts).toEqual({
      completed: dummyLessons.filter((l) => l.state === "done").length,
      total: dummyLessons.length,
      badgesEarned: dummyBadges.filter((b) => b.earned).length,
    });
  });
});
