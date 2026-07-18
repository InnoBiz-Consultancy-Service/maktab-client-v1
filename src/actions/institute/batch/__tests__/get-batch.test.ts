import { universalApi } from "@/actions/universal-api";
import { getBatchAction } from "@/actions/institute/batch/get-batch";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("getBatchAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("requests the batch by id", async () => {
    mockedApi.mockResolvedValue({ success: true, data: { id: "b1" } });
    await getBatchAction("b1");
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "/batches/b1", method: "GET" }),
    );
  });

  it("unwraps a { data: {...} } envelope", async () => {
    mockedApi.mockResolvedValue({
      success: true,
      data: { data: { id: "b1", name: "Class 5" } },
    });
    const result = await getBatchAction("b1");
    expect(result).toEqual({ ok: true, data: { id: "b1", name: "Class 5" } });
  });

  it("maps a 403/404 style failure to a friendly error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Not found" });
    const result = await getBatchAction("missing");
    expect(result).toEqual({ ok: false, error: "Not found" });
  });

  it("falls back to a default message when none is given", async () => {
    mockedApi.mockResolvedValue({ success: false });
    const result = await getBatchAction("b1");
    expect(result).toEqual({ ok: false, error: "Could not load this batch." });
  });
});
