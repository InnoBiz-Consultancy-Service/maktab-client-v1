import { universalApi } from "@/actions/universal-api";
import { searchStudentsAction } from "@/actions/institute/student/get-students";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("searchStudentsAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("hits /students with no query when the term is blank", async () => {
    mockedApi.mockResolvedValue({ success: true, data: [] });
    await searchStudentsAction("");
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "/students", method: "GET" }),
    );
  });

  it("trims and URL-encodes the search term", async () => {
    mockedApi.mockResolvedValue({ success: true, data: [] });
    await searchStudentsAction("  class 5 ");
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "/students?search=class%205" }),
    );
  });

  it("unwraps a { data: [...] } envelope response", async () => {
    const students = [{ id: "s1", name: "Abdullah" }];
    mockedApi.mockResolvedValue({ success: true, data: { data: students } });
    const result = await searchStudentsAction("abdullah");
    expect(result).toEqual({ ok: true, data: students });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Server down" });
    const result = await searchStudentsAction("");
    expect(result).toEqual({ ok: false, error: "Server down" });
  });
});
