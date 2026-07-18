import { universalApi } from "@/actions/universal-api";
import { startDayAction } from "@/actions/attendance/start-day";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("startDayAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("POSTs the batchId to /attendance/days", async () => {
    mockedApi.mockResolvedValue({ success: true, data: { id: "d1" } });
    await startDayAction({ batchId: "b1" });
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/attendance/days",
        method: "POST",
        data: { batchId: "b1" },
      }),
    );
  });

  it("unwraps a { data: {...} } envelope", async () => {
    mockedApi.mockResolvedValue({
      success: true,
      data: { data: { id: "d1", batchId: "b1" } },
    });
    const result = await startDayAction({ batchId: "b1" });
    expect(result).toEqual({ ok: true, data: { id: "d1", batchId: "b1" } });
  });

  it("maps a 409 (already started / off-day) failure to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Already started" });
    const result = await startDayAction({ batchId: "b1" });
    expect(result).toEqual({ ok: false, error: "Already started" });
  });

  it("falls back to a default message when none is given", async () => {
    mockedApi.mockResolvedValue({ success: false });
    const result = await startDayAction({ batchId: "b1" });
    expect(result).toEqual({
      ok: false,
      error: "Could not start attendance.",
    });
  });
});
