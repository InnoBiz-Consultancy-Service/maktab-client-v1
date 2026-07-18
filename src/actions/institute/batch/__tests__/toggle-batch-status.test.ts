import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import { toggleBatchStatusAction } from "@/actions/institute/batch/toggle-batch-status";

jest.mock("@/actions/universal-api");
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

const mockedApi = universalApi as jest.Mock;

describe("toggleBatchStatusAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("PATCHes the toggle-status endpoint and revalidates both routes", async () => {
    mockedApi.mockResolvedValue({
      success: true,
      data: { id: "b1", isActive: false },
    });

    const result = await toggleBatchStatusAction("b1");

    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/batches/b1/toggle-status",
        method: "PATCH",
      }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/institute/batches");
    expect(revalidatePath).toHaveBeenCalledWith(
      "/dashboard/institute/batches/b1",
    );
    expect(result).toEqual({ ok: true, data: { id: "b1", isActive: false } });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Not allowed" });
    const result = await toggleBatchStatusAction("b1");
    expect(result).toEqual({ ok: false, error: "Not allowed" });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
