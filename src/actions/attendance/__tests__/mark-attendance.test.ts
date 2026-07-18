import { universalApi } from "@/actions/universal-api";
import { markAttendanceAction } from "@/actions/attendance/mark-attendance";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("markAttendanceAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("POSTs the records and finalize flag to /attendance/days/:id/mark", async () => {
    mockedApi.mockResolvedValue({ success: true, data: {} });
    const input = {
      records: [{ studentId: "s1", status: "PRESENT" as const }],
      finalize: false,
    };
    await markAttendanceAction("d1", input);
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/attendance/days/d1/mark",
        method: "POST",
        data: input,
      }),
    );
  });

  it("unwraps the roster response on success", async () => {
    const roster = { day: { id: "d1" }, batch: { id: "b1" }, students: [] };
    mockedApi.mockResolvedValue({ success: true, data: { data: roster } });
    const result = await markAttendanceAction("d1", {
      records: [],
      finalize: true,
    });
    expect(result).toEqual({ ok: true, data: roster });
  });

  it("maps a failed save to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Day is locked" });
    const result = await markAttendanceAction("d1", {
      records: [],
      finalize: true,
    });
    expect(result).toEqual({ ok: false, error: "Day is locked" });
  });
});
