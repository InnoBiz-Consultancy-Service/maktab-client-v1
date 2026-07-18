import { getTodayAction } from "@/actions/attendance/get-today";
import { getTeacherOverviewAction } from "@/actions/teacher/overview";
import { dummyMyStudents, dummyMarks, dummyExams } from "@/lib/dummy/teacher";
import type { TodayBatch } from "@/types/attendance";

jest.mock("@/actions/attendance/get-today");

const mockedGetToday = getTodayAction as jest.Mock;

function batch(id: string, state: TodayBatch["state"], extra: Partial<TodayBatch> = {}): TodayBatch {
  return {
    batch: { id, name: `Batch ${id}` },
    totalStudents: 10,
    state,
    ...extra,
  };
}

describe("getTeacherOverviewAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("propagates a failure from the real attendance/today call", async () => {
    mockedGetToday.mockResolvedValue({ ok: false, error: "Server down" });
    const result = await getTeacherOverviewAction();
    expect(result).toEqual({ ok: false, error: "Server down" });
  });

  it("returns the placeholder students/marks/exams alongside real today-batches", async () => {
    mockedGetToday.mockResolvedValue({
      ok: true,
      data: { date: "2026-07-18", batches: [batch("b1", "NOT_STARTED")] },
    });

    const result = await getTeacherOverviewAction();

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.students).toEqual(dummyMyStudents);
    expect(result.data.recentMarks).toEqual(dummyMarks);
    expect(result.data.exams).toEqual(dummyExams);
    expect(result.data.todayBatches).toEqual([batch("b1", "NOT_STARTED")]);
  });

  it("counts NOT_STARTED and IN_PROGRESS batches as pending, excluding DONE/OFF_DAY", async () => {
    mockedGetToday.mockResolvedValue({
      ok: true,
      data: {
        date: "2026-07-18",
        batches: [
          batch("b1", "NOT_STARTED"),
          batch("b2", "IN_PROGRESS"),
          batch("b3", "DONE"),
          batch("b4", "OFF_DAY"),
        ],
      },
    });

    const result = await getTeacherOverviewAction();
    if (!result.ok) throw new Error("expected ok");
    expect(result.data.counts.attendancePending).toBe(2);
    expect(result.data.counts.students).toBe(dummyMyStudents.length);
  });

  it("computes the class average as the rounded mean of student averages", async () => {
    mockedGetToday.mockResolvedValue({
      ok: true,
      data: { date: "2026-07-18", batches: [] },
    });

    const result = await getTeacherOverviewAction();
    if (!result.ok) throw new Error("expected ok");
    const expectedAverage = Math.round(
      dummyMyStudents.reduce((sum, s) => sum + s.average, 0) /
        dummyMyStudents.length,
    );
    expect(result.data.counts.classAverage).toBe(expectedAverage);
  });
});
