import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import {
  addBatchTeachersAction,
  removeBatchTeachersAction,
} from "@/actions/institute/batch/manage-batch-teachers";

jest.mock("@/actions/universal-api");
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

const mockedApi = universalApi as jest.Mock;

describe("addBatchTeachersAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("rejects an empty teacherIds list before calling the API", async () => {
    const result = await addBatchTeachersAction("b1", []);
    expect(result.ok).toBe(false);
    expect(mockedApi).not.toHaveBeenCalled();
  });

  it("PATCHes the batch's teachers endpoint and revalidates both routes", async () => {
    mockedApi.mockResolvedValue({ success: true, data: { id: "b1" } });
    await addBatchTeachersAction("b1", ["t1"]);

    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/batches/b1/teachers",
        method: "PATCH",
        data: { teacherIds: ["t1"] },
      }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/institute/batches");
    expect(revalidatePath).toHaveBeenCalledWith(
      "/dashboard/institute/batches/b1",
    );
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Already assigned" });
    const result = await addBatchTeachersAction("b1", ["t1"]);
    expect(result).toEqual({ ok: false, error: "Already assigned" });
  });
});

describe("removeBatchTeachersAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("rejects an empty teacherIds list before calling the API", async () => {
    const result = await removeBatchTeachersAction("b1", []);
    expect(result.ok).toBe(false);
    expect(mockedApi).not.toHaveBeenCalled();
  });

  it("DELETEs the batch's teachers endpoint and revalidates both routes", async () => {
    mockedApi.mockResolvedValue({ success: true, data: { id: "b1" } });
    await removeBatchTeachersAction("b1", ["t1"]);

    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/batches/b1/teachers",
        method: "DELETE",
        data: { teacherIds: ["t1"] },
      }),
    );
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Not assigned" });
    const result = await removeBatchTeachersAction("b1", ["t1"]);
    expect(result).toEqual({ ok: false, error: "Not assigned" });
  });
});
