import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import {
  createTeacherAction,
  type CreateTeacherState,
} from "@/actions/institute/teacher/create-teacher";

jest.mock("@/actions/universal-api");
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

const mockedApi = universalApi as jest.Mock;

const initialState: CreateTeacherState = { success: false };

function buildFormData(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  const values: Record<string, string> = {
    name: "Abdul Karim",
    email: "karim@test.com",
    password: "secret1",
    gender: "MALE",
    education: "BA Islamic Studies",
    phone: "01711223344",
    address: "Dhaka",
    ...overrides,
  };
  for (const [key, value] of Object.entries(values)) fd.set(key, value);
  return fd;
}

describe("createTeacherAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("returns field errors without calling the API when validation fails", async () => {
    const result = await createTeacherAction(
      initialState,
      buildFormData({ email: "not-an-email" }),
    );

    expect(result.success).toBe(false);
    expect(result.fieldErrors?.email).toBeDefined();
    expect(mockedApi).not.toHaveBeenCalled();
  });

  it("creates a teacher, revalidates the dashboard, and returns createdTeacher", async () => {
    mockedApi.mockResolvedValue({
      success: true,
      data: { data: { id: "t1", name: "Abdul Karim" } },
    });

    const result = await createTeacherAction(initialState, buildFormData());

    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "/teachers", method: "POST" }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/institute");
    expect(result).toEqual({
      success: true,
      createdTeacher: { id: "t1", name: "Abdul Karim" },
    });
  });

  it("maps a duplicate-email API error to a field error", async () => {
    mockedApi.mockResolvedValue({
      success: false,
      message: "This email is already registered",
    });

    const result = await createTeacherAction(initialState, buildFormData());

    expect(result.success).toBe(false);
    expect(result.fieldErrors?.email).toBe("This email is already in use.");
    expect(result.formError).toBe("Please fix the highlighted fields.");
  });

  it("falls back to a plain formError when the API failure isn't email/phone related", async () => {
    mockedApi.mockResolvedValue({ success: false, message: "Server error" });

    const result = await createTeacherAction(initialState, buildFormData());

    expect(result).toEqual({
      success: false,
      formError: "Server error",
      fieldErrors: undefined,
      values: expect.any(Object),
    });
  });
});
