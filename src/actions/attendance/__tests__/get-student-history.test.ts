import { universalApi } from "@/actions/universal-api";
import { getStudentHistoryAction } from "@/actions/attendance/get-student-history";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("getStudentHistoryAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("requests the plain endpoint when no params are given", async () => {
    mockedApi.mockResolvedValue({ success: true, data: [] });
    await getStudentHistoryAction("s1");
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/attendance/students/s1/history",
        method: "GET",
      }),
    );
  });

  it("builds a query string from from/to/status", async () => {
    mockedApi.mockResolvedValue({ success: true, data: [] });
    await getStudentHistoryAction("s1", {
      from: "2026-07-01",
      to: "2026-07-18",
      status: "ABSENT",
    });
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint:
          "/attendance/students/s1/history?from=2026-07-01&to=2026-07-18&status=ABSENT",
      }),
    );
  });

  it("unwraps the history entries on success", async () => {
    const history = [{ date: "2026-07-01", status: "PRESENT", markedBy: "t1" }];
    mockedApi.mockResolvedValue({ success: true, data: { data: history } });
    const result = await getStudentHistoryAction("s1");
    expect(result).toEqual({ ok: true, data: history });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Not found" });
    const result = await getStudentHistoryAction("s1");
    expect(result).toEqual({ ok: false, error: "Not found" });
  });
});
