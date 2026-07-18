import { universalApi } from "@/actions/universal-api";
import { getNotificationsAction } from "@/actions/attendance/get-notification";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("getNotificationsAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("requests /notifications", async () => {
    mockedApi.mockResolvedValue({ success: true, data: [] });
    await getNotificationsAction();
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "/notifications", method: "GET" }),
    );
  });

  it("unwraps a bare-array response", async () => {
    const notifications = [{ id: "n1" }];
    mockedApi.mockResolvedValue({ success: true, data: notifications });
    const result = await getNotificationsAction();
    expect(result).toEqual({ ok: true, data: notifications });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Server error" });
    const result = await getNotificationsAction();
    expect(result).toEqual({ ok: false, error: "Server error" });
  });
});
