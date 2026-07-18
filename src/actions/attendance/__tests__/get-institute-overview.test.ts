import { universalApi } from "@/actions/universal-api";
import { getInstituteOverviewAction } from "@/actions/attendance/get-institute-overview";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("getInstituteOverviewAction (attendance)", () => {
  afterEach(() => jest.resetAllMocks());

  it("requests the plain endpoint when no params are given", async () => {
    mockedApi.mockResolvedValue({ success: true, data: {} });
    await getInstituteOverviewAction();
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/attendance/institute/overview",
        method: "GET",
      }),
    );
  });

  it("builds a query string from from/to/below", async () => {
    mockedApi.mockResolvedValue({ success: true, data: {} });
    await getInstituteOverviewAction({ from: "2026-07-01", to: "2026-07-18", below: 60 });
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint:
          "/attendance/institute/overview?from=2026-07-01&to=2026-07-18&below=60",
      }),
    );
  });

  it("unwraps the overview on success", async () => {
    const overview = {
      totalBatches: 5,
      totalStudents: 50,
      instituteAverage: 88,
      totalLowStudents: 2,
      lowThreshold: 75,
      batches: [],
    };
    mockedApi.mockResolvedValue({ success: true, data: { data: overview } });
    const result = await getInstituteOverviewAction();
    expect(result).toEqual({ ok: true, data: overview });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Server error" });
    const result = await getInstituteOverviewAction();
    expect(result).toEqual({ ok: false, error: "Server error" });
  });
});
