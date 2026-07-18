import { universalApi } from "@/actions/universal-api";
import { searchTeachersAction } from "@/actions/institute/teacher/get-teacher";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("searchTeachersAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("hits /teachers with no query when the term is blank", async () => {
    mockedApi.mockResolvedValue({ success: true, data: [] });
    await searchTeachersAction("");
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "/teachers", method: "GET" }),
    );
  });

  it("trims and URL-encodes the search term", async () => {
    mockedApi.mockResolvedValue({ success: true, data: [] });
    await searchTeachersAction("  abdul karim ");
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "/teachers?search=abdul%20karim" }),
    );
  });

  it("unwraps a bare-array response", async () => {
    const teachers = [{ id: "t1", name: "Abdul Karim" }];
    mockedApi.mockResolvedValue({ success: true, data: teachers });
    const result = await searchTeachersAction("karim");
    expect(result).toEqual({ ok: true, data: teachers });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Server down" });
    const result = await searchTeachersAction("");
    expect(result).toEqual({ ok: false, error: "Server down" });
  });
});
