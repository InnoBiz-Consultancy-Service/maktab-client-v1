import { universalApi } from "@/actions/universal-api";
import { getBatchesAction } from "@/actions/institute/batch/get-batches";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("getBatchesAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("hits /batches with no query when search is blank", async () => {
    mockedApi.mockResolvedValue({ success: true, data: [] });
    await getBatchesAction();
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "/batches", method: "GET" }),
    );
  });

  it("trims and URL-encodes the search term", async () => {
    mockedApi.mockResolvedValue({ success: true, data: [] });
    await getBatchesAction("  class 5 ");
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "/batches?search=class%205" }),
    );
  });

  it("unwraps a bare-array response", async () => {
    const batches = [{ id: "1", name: "Class 5" }];
    mockedApi.mockResolvedValue({ success: true, data: batches });

    const result = await getBatchesAction();

    expect(result).toEqual({ ok: true, data: batches });
  });

  it("unwraps a { data: [...] } envelope response", async () => {
    const batches = [{ id: "1", name: "Class 5" }];
    mockedApi.mockResolvedValue({ success: true, data: { data: batches } });

    const result = await getBatchesAction();

    expect(result).toEqual({ ok: true, data: batches });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Server down" });

    const result = await getBatchesAction();

    expect(result).toEqual({ ok: false, error: "Server down" });
  });

  it("falls back to a default error message when none is given", async () => {
    mockedApi.mockResolvedValue({ success: false });

    const result = await getBatchesAction();

    expect(result).toEqual({ ok: false, error: "Could not load batches." });
  });
});
