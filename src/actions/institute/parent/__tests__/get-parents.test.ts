import { universalApi } from "@/actions/universal-api";
import { searchParentsAction } from "@/actions/institute/parent/get-parents";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("searchParentsAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("hits /parents with no query when the term is blank", async () => {
    mockedApi.mockResolvedValue({ success: true, data: [] });
    await searchParentsAction("");
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "/parents", method: "GET" }),
    );
  });

  it("trims and URL-encodes the search term", async () => {
    mockedApi.mockResolvedValue({ success: true, data: [] });
    await searchParentsAction("  rahim uddin ");
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "/parents?search=rahim%20uddin" }),
    );
  });

  it("unwraps a bare-array response", async () => {
    const parents = [{ id: "p1", name: "Rahim" }];
    mockedApi.mockResolvedValue({ success: true, data: parents });
    const result = await searchParentsAction("rahim");
    expect(result).toEqual({ ok: true, data: parents });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Server down" });
    const result = await searchParentsAction("");
    expect(result).toEqual({ ok: false, error: "Server down" });
  });
});
