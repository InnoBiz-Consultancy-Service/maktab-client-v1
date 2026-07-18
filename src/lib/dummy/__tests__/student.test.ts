import { rankForXp, ranks } from "@/lib/dummy/student";

describe("rankForXp", () => {
  it("returns the lowest rank with 0 xp and no next-rank progress backwards", () => {
    const result = rankForXp(0);
    expect(result.current.id).toBe("new-talib");
    expect(result.next?.id).toBe("eager-learner");
    expect(result.progress).toBe(0);
  });

  it("picks the highest rank whose minXp the xp meets or exceeds", () => {
    expect(rankForXp(420).current.id).toBe("devoted-student");
    expect(rankForXp(99).current.id).toBe("new-talib");
    expect(rankForXp(100).current.id).toBe("eager-learner");
  });

  it("computes progress toward the next rank as a percentage", () => {
    // eager-learner (100) -> devoted-student (300): halfway at 200
    const result = rankForXp(200);
    expect(result.current.id).toBe("eager-learner");
    expect(result.next?.id).toBe("devoted-student");
    expect(result.progress).toBe(50);
  });

  it("caps progress at 100 and has no next rank at the top", () => {
    const topRank = ranks[ranks.length - 1];
    const result = rankForXp(topRank.minXp + 1000);
    expect(result.current.id).toBe(topRank.id);
    expect(result.next).toBeNull();
    expect(result.progress).toBe(100);
  });

  it("treats exactly hitting a rank's minXp as reaching that rank", () => {
    const result = rankForXp(300);
    expect(result.current.id).toBe("devoted-student");
  });
});
