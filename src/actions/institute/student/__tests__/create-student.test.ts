import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import {
  createStudentAction,
  type CreateStudentPayload,
} from "@/actions/institute/student/create-student";

jest.mock("@/actions/universal-api");
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

const mockedApi = universalApi as jest.Mock;

const basePayload: CreateStudentPayload = {
  name: "Abdullah Rahman",
  class: "Nursery",
  dob: "2018-05-01",
  gender: "MALE",
  photoConsent: true,
  teacherId: "t1",
  parentId: "p1",
};

describe("createStudentAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("rejects invalid input before calling the API", async () => {
    const result = await createStudentAction({ ...basePayload, name: "A" });
    expect(result.ok).toBe(false);
    expect(mockedApi).not.toHaveBeenCalled();
  });

  it("rejects when both parentId and parent are given", async () => {
    const result = await createStudentAction({
      ...basePayload,
      parent: {
        name: "Karim",
        email: "karim@test.com",
        phone: "01711223344",
        relation: "Father",
      },
    });
    expect(result.ok).toBe(false);
    expect(mockedApi).not.toHaveBeenCalled();
  });

  it("rejects when neither parentId nor parent is given", async () => {
    const { parentId: _parentId, ...withoutParent } = basePayload;
    const result = await createStudentAction(withoutParent);
    expect(result.ok).toBe(false);
    expect(mockedApi).not.toHaveBeenCalled();
  });

  it("sends parentId path without an allergies field when omitted", async () => {
    mockedApi.mockResolvedValue({ success: true, data: { id: "s1" } });
    await createStudentAction(basePayload);

    const call = mockedApi.mock.calls[0][0];
    expect(call.endpoint).toBe("/students");
    expect(call.method).toBe("POST");
    expect(call.data).toMatchObject({
      name: "Abdullah Rahman",
      class: "Nursery",
      gender: "MALE",
      photoConsent: true,
      teacherId: "t1",
      parentId: "p1",
    });
    expect(call.data.allergies).toBeUndefined();
    expect(call.data.parent).toBeUndefined();
    expect(call.data.dob).toBe(new Date("2018-05-01").toISOString());
  });

  it("sends the inline parent path when parent is given instead of parentId", async () => {
    mockedApi.mockResolvedValue({ success: true, data: { id: "s1" } });
    const { parentId: _parentId, ...withoutParentId } = basePayload;
    await createStudentAction({
      ...withoutParentId,
      allergies: "Peanuts",
      parent: {
        name: "Karim",
        email: "karim@test.com",
        phone: "01711223344",
        relation: "Father",
      },
    });

    const call = mockedApi.mock.calls[0][0];
    expect(call.data.parentId).toBeUndefined();
    expect(call.data.parent).toEqual({
      name: "Karim",
      email: "karim@test.com",
      phone: "01711223344",
      relation: "Father",
    });
    expect(call.data.allergies).toBe("Peanuts");
  });

  it("revalidates the dashboard and unwraps the created student on success", async () => {
    mockedApi.mockResolvedValue({
      success: true,
      data: { data: { id: "s1", studentCode: "104829" } },
    });

    const result = await createStudentAction(basePayload);

    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/institute");
    expect(result).toEqual({
      ok: true,
      data: { id: "s1", studentCode: "104829" },
    });
  });

  it("maps a failed call to an ActionResult error", async () => {
    mockedApi.mockResolvedValue({
      success: false,
      message: "Duplicate parent email — use the existing parents list",
    });
    const result = await createStudentAction(basePayload);
    expect(result).toEqual({
      ok: false,
      error: "Duplicate parent email — use the existing parents list",
    });
  });
});
