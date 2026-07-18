import { universalApi } from "@/actions/universal-api";
import { editRecordAction } from "@/actions/attendance/edit-record";

jest.mock("@/actions/universal-api");

const mockedApi = universalApi as jest.Mock;

describe("editRecordAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("PATCHes the record with the new status and reason", async () => {
    mockedApi.mockResolvedValue({ success: true, data: {} });
    await editRecordAction("r1", { status: "LATE", reason: "Traffic" });
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/attendance/records/r1",
        method: "PATCH",
        data: { status: "LATE", reason: "Traffic" },
      }),
    );
  });

  it("unwraps the updated record on success", async () => {
    const record = { id: "r1", dayId: "d1", studentId: "s1", status: "LATE", markedById: "t1" };
    mockedApi.mockResolvedValue({ success: true, data: { data: record } });
    const result = await editRecordAction("r1", { status: "LATE" });
    expect(result).toEqual({ ok: true, data: record });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Not the day owner" });
    const result = await editRecordAction("r1", { status: "ABSENT" });
    expect(result).toEqual({ ok: false, error: "Not the day owner" });
  });
});
