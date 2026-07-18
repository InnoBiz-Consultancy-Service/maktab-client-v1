import { universalApi } from "@/actions/universal-api";
import { getTodayAction } from "@/actions/attendance/get-today";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("getTodayAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("requests /attendance/today", async () => {
    mockedApi.mockResolvedValue({ success: true, data: {} });
    await getTodayAction();
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "/attendance/today", method: "GET" }),
    );
  });

  it("unwraps the today response", async () => {
    const today = { date: "2026-07-18", batches: [] };
    mockedApi.mockResolvedValue({ success: true, data: { data: today } });
    const result = await getTodayAction();
    expect(result).toEqual({ ok: true, data: today });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Server error" });
    const result = await getTodayAction();
    expect(result).toEqual({ ok: false, error: "Server error" });
  });
});
