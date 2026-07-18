import { redirect } from "next/navigation";
import { universalApi } from "@/actions/universal-api";
import { setAuthCookies, clearAuthCookies } from "@/lib/api/cookies";
import {
  loginAction,
  loginStudentAction,
  registerParentAction,
  logoutAction,
} from "@/actions/auth/login";

jest.mock("@/actions/universal-api");
jest.mock("@/lib/api/cookies");
jest.mock("next/navigation", () => ({ redirect: jest.fn() }));

const mockedApi = universalApi as jest.Mock;
const mockedSetAuthCookies = setAuthCookies as jest.Mock;
const mockedClearAuthCookies = clearAuthCookies as jest.Mock;

describe("loginAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("rejects when neither email nor phone is given", async () => {
    const result = await loginAction({ password: "secret" });
    expect(result).toEqual({
      ok: false,
      error: "Enter an email or a phone number",
    });
    expect(mockedApi).not.toHaveBeenCalled();
  });

  it("tries parent first, sets cookies, and stops on success", async () => {
    mockedApi.mockResolvedValueOnce({
      success: true,
      data: {
        accessToken: "at",
        refreshToken: "rt",
        user: { id: "u1", email: "parent@test.com", phone: null, role: "PARENT" },
      },
    });

    const result = await loginAction({
      email: "parent@test.com",
      password: "secret",
    });

    expect(mockedApi).toHaveBeenCalledTimes(1);
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "/auth/login/parent" }),
    );
    expect(mockedSetAuthCookies).toHaveBeenCalledWith(
      { accessToken: "at", refreshToken: "rt" },
      { kind: "user", id: "u1", role: "PARENT", label: "parent@test.com" },
    );
    expect(result).toEqual({ ok: true, data: undefined });
  });

  it("falls through 401s to the next role in order", async () => {
    mockedApi
      .mockResolvedValueOnce({ success: false, unauthorized: true }) // parent
      .mockResolvedValueOnce({ success: false, unauthorized: true }) // teacher
      .mockResolvedValueOnce({
        success: true,
        data: {
          accessToken: "at",
          refreshToken: "rt",
          user: { id: "u2", email: "inst@test.com", phone: null, role: "INSTITUTE" },
        },
      }); // institute

    const result = await loginAction({
      email: "inst@test.com",
      password: "secret",
    });

    expect(mockedApi).toHaveBeenCalledTimes(3);
    expect(mockedApi.mock.calls[2][0]).toMatchObject({
      endpoint: "/auth/login/institute",
    });
    expect(result).toEqual({ ok: true, data: undefined });
  });

  it("reports wrong credentials when every role returns 401", async () => {
    mockedApi.mockResolvedValue({ success: false, unauthorized: true });

    const result = await loginAction({
      email: "nobody@test.com",
      password: "secret",
    });

    expect(mockedApi).toHaveBeenCalledTimes(4); // parent, teacher, institute, admin
    expect(result).toEqual({ ok: false, error: "Wrong email or password." });
  });

  it("stops immediately on rate-limit without trying remaining roles", async () => {
    mockedApi.mockResolvedValueOnce({
      success: false,
      retryAfter: 30,
      message: "Slow down",
    });

    const result = await loginAction({
      email: "someone@test.com",
      password: "secret",
    });

    expect(mockedApi).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ok: false, error: "Slow down" });
  });

  it("stops immediately on a non-auth failure (e.g. 500)", async () => {
    mockedApi.mockResolvedValueOnce({
      success: false,
      message: "Server error",
    });

    const result = await loginAction({
      email: "someone@test.com",
      password: "secret",
    });

    expect(mockedApi).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ok: false, error: "Server error" });
  });

  it("reports an error if a 'successful' response is missing token or user", async () => {
    mockedApi.mockResolvedValueOnce({ success: true, data: {} });

    const result = await loginAction({
      email: "someone@test.com",
      password: "secret",
    });

    expect(result).toEqual({
      ok: false,
      error: "Unexpected response from server.",
    });
  });
});

describe("loginStudentAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("rejects a too-short student code before calling the API", async () => {
    const result = await loginStudentAction({ studentCode: "12" });
    expect(result.ok).toBe(false);
    expect(mockedApi).not.toHaveBeenCalled();
  });

  it("logs a student in and sets cookies", async () => {
    mockedApi.mockResolvedValueOnce({
      success: true,
      data: {
        accessToken: "at",
        refreshToken: "rt",
        student: { id: "s1", name: "Abdullah", class: "Nursery" },
      },
    });

    const result = await loginStudentAction({ studentCode: "104829" });

    expect(mockedSetAuthCookies).toHaveBeenCalledWith(
      { accessToken: "at", refreshToken: "rt" },
      { kind: "student", id: "s1", role: "STUDENT", label: "Abdullah" },
    );
    expect(result).toEqual({ ok: true, data: undefined });
  });

  it("surfaces the API error message on failure", async () => {
    mockedApi.mockResolvedValueOnce({
      success: false,
      message: "Invalid code",
    });

    const result = await loginStudentAction({ studentCode: "104829" });
    expect(result).toEqual({ ok: false, error: "Invalid code" });
  });
});

describe("registerParentAction", () => {
  afterEach(() => jest.resetAllMocks());

  const validPayload = {
    name: "Rahim Uddin",
    email: "rahim@test.com",
    password: "secret1",
    phone: "01711223344",
    profession: "Teacher",
    address: "Dhaka",
    emergencyContact: "01711223345",
  };

  it("rejects invalid input before calling the API", async () => {
    const result = await registerParentAction({ ...validPayload, email: "bad" });
    expect(result.ok).toBe(false);
    expect(mockedApi).not.toHaveBeenCalled();
  });

  it("registers a parent successfully", async () => {
    mockedApi.mockResolvedValueOnce({ success: true, data: {} });
    const result = await registerParentAction(validPayload);
    expect(result).toEqual({ ok: true, data: undefined });
    expect(mockedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/auth/register/parent",
        method: "POST",
      }),
    );
  });

  it("surfaces the API error message on failure", async () => {
    mockedApi.mockResolvedValueOnce({
      success: false,
      message: "Email already registered",
    });
    const result = await registerParentAction(validPayload);
    expect(result).toEqual({ ok: false, error: "Email already registered" });
  });
});

describe("logoutAction", () => {
  afterEach(() => jest.resetAllMocks());

  it("clears cookies and redirects to login", async () => {
    await logoutAction();
    expect(mockedClearAuthCookies).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
