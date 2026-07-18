import { universalApi } from "@/actions/universal-api";
import { getStudentSummaryAction } from "@/actions/attendance/get-student-summary";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("getStudentSummaryAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("requests the plain endpoint when no params are given (current month)", async () => {
    mockedApi.mockResolvedValue({ success: true, data: {} });
    await getStudentSummaryAction("s1");
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/attendance/students/s1/summary",
        method: "GET",
      }),
    );
  });

  it("puts preset first, then from/to, in the query string", async () => {
    mockedApi.mockResolvedValue({ success: true, data: {} });
    await getStudentSummaryAction("s1", {
      preset: "all",
      from: "2026-01-01",
      to: "2026-07-18",
    });
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint:
          "/attendance/students/s1/summary?preset=all&from=2026-01-01&to=2026-07-18",
      }),
    );
  });

  it("unwraps the summary on success", async () => {
    const summary = {
      student: { id: "s1", name: "Abdullah", studentCode: "104829", class: "Nursery" },
      range: { from: "2026-07-01", to: "2026-07-18" },
      totalClassDays: 15,
      present: 12,
      late: 1,
      lateDates: ["2026-07-05"],
      absent: 2,
      notMarked: 0,
      percentage: 80,
    };
    mockedApi.mockResolvedValue({ success: true, data: { data: summary } });
    const result = await getStudentSummaryAction("s1");
    expect(result).toEqual({ ok: true, data: summary });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Not found" });
    const result = await getStudentSummaryAction("s1");
    expect(result).toEqual({ ok: false, error: "Not found" });
  });
});
