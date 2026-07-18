import { universalApi } from "@/actions/universal-api";
import { getRosterAction } from "@/actions/attendance/get-roster";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("getRosterAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("requests the roster for the given day", async () => {
    mockedApi.mockResolvedValue({ success: true, data: {} });
    await getRosterAction("d1");
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/attendance/days/d1/roster",
        method: "GET",
      }),
    );
  });

  it("unwraps the roster response", async () => {
    const roster = { day: { id: "d1" }, batch: { id: "b1" }, students: [] };
    mockedApi.mockResolvedValue({ success: true, data: { data: roster } });
    const result = await getRosterAction("d1");
    expect(result).toEqual({ ok: true, data: roster });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Day not found" });
    const result = await getRosterAction("missing");
    expect(result).toEqual({ ok: false, error: "Day not found" });
  });
});
