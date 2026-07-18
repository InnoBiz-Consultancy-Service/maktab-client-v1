import { universalApi } from "@/actions/universal-api";
import { markOffDayAction } from "@/actions/attendance/mark-off-day";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("markOffDayAction", () => {
  afterEach(() => jest.resetAllMocks());

  const input = {
    batchId: "b1",
    startDate: "2026-07-20",
    endDate: "2026-07-21",
    reason: "Eid holiday",
  };

  it("POSTs the input to /attendance/off-days", async () => {
    mockedApi.mockResolvedValue({ success: true, data: {} });
    await markOffDayAction(input);
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/attendance/off-days",
        method: "POST",
        data: input,
      }),
    );
  });

  it("unwraps the created/skipped summary on success", async () => {
    const response = { created: 2, skipped: [] };
    mockedApi.mockResolvedValue({ success: true, data: { data: response } });
    const result = await markOffDayAction(input);
    expect(result).toEqual({ ok: true, data: response });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Too many days" });
    const result = await markOffDayAction(input);
    expect(result).toEqual({ ok: false, error: "Too many days" });
  });
});
