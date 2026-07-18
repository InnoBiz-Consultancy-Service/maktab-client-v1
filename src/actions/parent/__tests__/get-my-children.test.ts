import { universalApi } from "@/actions/universal-api";
import { getMyChildrenAction } from "@/actions/parent/get-my-children";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("getMyChildrenAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("calls /parents/my-children", async () => {
    mockedApi.mockResolvedValue({ success: true, data: [] });
    await getMyChildrenAction();
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/parents/my-children",
        method: "GET",
      }),
    );
  });

  it("unwraps a { data: [...] } envelope", async () => {
    const children = [{ id: "1", name: "Abdullah" }];
    mockedApi.mockResolvedValue({ success: true, data: { data: children } });

    const result = await getMyChildrenAction();

    expect(result).toEqual({ ok: true, data: children });
  });

  it("passes through a bare array unchanged", async () => {
    const children = [{ id: "1", name: "Abdullah" }];
    mockedApi.mockResolvedValue({ success: true, data: children });

    const result = await getMyChildrenAction();

    expect(result).toEqual({ ok: true, data: children });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Not linked" });

    const result = await getMyChildrenAction();

    expect(result).toEqual({ ok: false, error: "Not linked" });
  });
});
