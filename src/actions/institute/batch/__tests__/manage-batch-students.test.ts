import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import {
  addBatchStudentsAction,
  removeBatchStudentsAction,
} from "@/actions/institute/batch/manage-batch-students";

jest.mock("@/actions/universal-api");
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

const mockedApi = universalApi as jest.Mock;

describe("addBatchStudentsAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("rejects an empty studentIds list before calling the API", async () => {
    const result = await addBatchStudentsAction("b1", []);
    expect(result.ok).toBe(false);
    expect(mockedApi).not.toHaveBeenCalled();
  });

  it("PATCHes the batch's students endpoint and revalidates both routes", async () => {
    mockedApi.mockResolvedValue({ success: true, data: { id: "b1" } });
    await addBatchStudentsAction("b1", ["s1", "s2"]);

    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/batches/b1/students",
        method: "PATCH",
        data: { studentIds: ["s1", "s2"] },
      }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/institute/batches");
    expect(revalidatePath).toHaveBeenCalledWith(
      "/dashboard/institute/batches/b1",
    );
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Already in batch" });
    const result = await addBatchStudentsAction("b1", ["s1"]);
    expect(result).toEqual({ ok: false, error: "Already in batch" });
  });
});

describe("removeBatchStudentsAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("rejects an empty studentIds list before calling the API", async () => {
    const result = await removeBatchStudentsAction("b1", []);
    expect(result.ok).toBe(false);
    expect(mockedApi).not.toHaveBeenCalled();
  });

  it("DELETEs the batch's students endpoint and revalidates both routes", async () => {
    mockedApi.mockResolvedValue({ success: true, data: { id: "b1" } });
    await removeBatchStudentsAction("b1", ["s1"]);

    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/batches/b1/students",
        method: "DELETE",
        data: { studentIds: ["s1"] },
      }),
    );
    expect(revalidatePath).toHaveBeenCalledWith(
      "/dashboard/institute/batches/b1",
    );
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Not in batch" });
    const result = await removeBatchStudentsAction("b1", ["s1"]);
    expect(result).toEqual({ ok: false, error: "Not in batch" });
  });
});
