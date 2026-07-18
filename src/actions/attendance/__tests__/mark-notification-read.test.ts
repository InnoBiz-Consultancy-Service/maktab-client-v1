import { universalApi } from "@/actions/universal-api";
import { markNotificationReadAction } from "@/actions/attendance/mark-notification-read";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("markNotificationReadAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("PATCHes the notification's read endpoint", async () => {
    mockedApi.mockResolvedValue({ success: true, data: {} });
    await markNotificationReadAction("n1");
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/notifications/n1/read",
        method: "PATCH",
      }),
    );
  });

  it("unwraps the updated notification on success", async () => {
    const notification = { id: "n1", isRead: true };
    mockedApi.mockResolvedValue({ success: true, data: { data: notification } });
    const result = await markNotificationReadAction("n1");
    expect(result).toEqual({ ok: true, data: notification });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Not found" });
    const result = await markNotificationReadAction("n1");
    expect(result).toEqual({ ok: false, error: "Not found" });
  });
});
