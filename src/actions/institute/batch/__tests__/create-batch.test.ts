import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import { createBatchAction } from "@/actions/institute/batch/create-batch";

jest.mock("@/actions/universal-api");
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

const mockedApi = universalApi as jest.Mock;

describe("createBatchAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("rejects a name that is too short before calling the API", async () => {
    const result = await createBatchAction({ name: "A" });
    expect(result.ok).toBe(false);
    expect(mockedApi).not.toHaveBeenCalled();
  });

  it("omits empty teacherIds/studentIds from the request body", async () => {
    mockedApi.mockResolvedValue({ success: true, data: { id: "1" } });
    await createBatchAction({ name: "Class 5" });
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/batches",
        method: "POST",
        data: { name: "Class 5" },
      }),
    );
  });

  it("includes teacherIds/studentIds when provided", async () => {
    mockedApi.mockResolvedValue({ success: true, data: { id: "1" } });
    await createBatchAction({
      name: "Class 5",
      teacherIds: ["t1"],
      studentIds: ["s1", "s2"],
    });
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { name: "Class 5", teacherIds: ["t1"], studentIds: ["s1", "s2"] },
      }),
    );
  });

  it("revalidates the batches list and unwraps the created batch on success", async () => {
    mockedApi.mockResolvedValue({
      success: true,
      data: { data: { id: "1", name: "Class 5" } },
    });

    const result = await createBatchAction({ name: "Class 5" });

    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/institute/batches");
    expect(result).toEqual({ ok: true, data: { id: "1", name: "Class 5" } });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Duplicate name" });
    const result = await createBatchAction({ name: "Class 5" });
    expect(result).toEqual({ ok: false, error: "Duplicate name" });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
