import { universalApi } from "@/actions/universal-api";
import { getMissingTodayAction } from "@/actions/attendance/get-missing-today";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("getMissingTodayAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("requests /attendance/institute/missing-today", async () => {
    mockedApi.mockResolvedValue({ success: true, data: {} });
    await getMissingTodayAction();
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/attendance/institute/missing-today",
        method: "GET",
      }),
    );
  });

  it("unwraps the missing-today response", async () => {
    const missing = { date: "2026-07-18", missingCount: 2, batches: [] };
    mockedApi.mockResolvedValue({ success: true, data: { data: missing } });
    const result = await getMissingTodayAction();
    expect(result).toEqual({ ok: true, data: missing });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Server error" });
    const result = await getMissingTodayAction();
    expect(result).toEqual({ ok: false, error: "Server error" });
  });
});
