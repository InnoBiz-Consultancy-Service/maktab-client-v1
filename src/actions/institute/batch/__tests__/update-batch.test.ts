import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import { updateBatchAction } from "@/actions/institute/batch/update-batch";

jest.mock("@/actions/universal-api");
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

const mockedApi = universalApi as jest.Mock;

describe("updateBatchAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("rejects a name that is too short before calling the API", async () => {
    const result = await updateBatchAction("b1", { name: "A" });
    expect(result.ok).toBe(false);
    expect(mockedApi).not.toHaveBeenCalled();
  });

  it("PATCHes the batch and revalidates both routes on success", async () => {
    mockedApi.mockResolvedValue({
      success: true,
      data: { id: "b1", name: "Class 5A" },
    });

    const result = await updateBatchAction("b1", { name: "Class 5A" });

    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/batches/b1",
        method: "PATCH",
        data: { name: "Class 5A" },
      }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/institute/batches");
    expect(revalidatePath).toHaveBeenCalledWith(
      "/dashboard/institute/batches/b1",
    );
    expect(result).toEqual({ ok: true, data: { id: "b1", name: "Class 5A" } });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Duplicate name" });
    const result = await updateBatchAction("b1", { name: "Class 5A" });
    expect(result).toEqual({ ok: false, error: "Duplicate name" });
  });
});
