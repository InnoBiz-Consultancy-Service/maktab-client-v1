import { universalApi } from "@/actions/universal-api";
import { getBatchReportAction } from "@/actions/attendance/get-batch-report";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("getBatchReportAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("requests the plain endpoint when no params are given", async () => {
    mockedApi.mockResolvedValue({ success: true, data: {} });
    await getBatchReportAction("b1");
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/attendance/batches/b1/report",
        method: "GET",
      }),
    );
  });

  it("builds a query string from from/to/below", async () => {
    mockedApi.mockResolvedValue({ success: true, data: {} });
    await getBatchReportAction("b1", { from: "2026-07-01", to: "2026-07-18", below: 75 });
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint:
          "/attendance/batches/b1/report?from=2026-07-01&to=2026-07-18&below=75",
      }),
    );
  });

  it("omits absent params from the query string", async () => {
    mockedApi.mockResolvedValue({ success: true, data: {} });
    await getBatchReportAction("b1", { below: 50 });
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/attendance/batches/b1/report?below=50",
      }),
    );
  });

  it("unwraps the report on success", async () => {
    const report = { batch: { id: "b1" }, totalStudents: 10, batchAverage: 90, students: [] };
    mockedApi.mockResolvedValue({ success: true, data: { data: report } });
    const result = await getBatchReportAction("b1");
    expect(result).toEqual({ ok: true, data: report });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Not found" });
    const result = await getBatchReportAction("b1");
    expect(result).toEqual({ ok: false, error: "Not found" });
  });
});
