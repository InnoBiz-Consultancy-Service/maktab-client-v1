import { cookies } from "next/headers";
import { universalApi } from "@/actions/universal-api";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

function mockCookies(token: string | undefined) {
  (cookies as jest.Mock).mockResolvedValue({
    get: jest.fn().mockReturnValue(token ? { value: token } : undefined),
  });
}

function mockFetchOnce(response: Partial<Response> & { json?: () => unknown }) {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    status: 200,
    headers: new Headers(),
    json: async () => ({}),
    ...response,
  });
}

describe("universalApi", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, BASE_URL: "https://api.test" };
    global.fetch = jest.fn();
    mockCookies("token-abc");
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.resetAllMocks();
  });

  it("throws if BASE_URL is not configured", async () => {
    process.env.BASE_URL = "";
    process.env.NEXT_PUBLIC_BASE_URL = "";
    await expect(universalApi({ endpoint: "/batches" })).rejects.toThrow(
      "BASE_URL is not set in environment variables",
    );
  });

  it("returns success with parsed data on a 2xx response", async () => {
    mockFetchOnce({ json: async () => ({ id: "1", name: "Class 5" }) });

    const result = await universalApi<{ id: string; name: string }>({
      endpoint: "/batches/1",
    });

    expect(result).toEqual({
      success: true,
      data: { id: "1", name: "Class 5" },
    });
  });

  it("attaches the bearer token when requireAuth and a token exist", async () => {
    mockFetchOnce({});
    await universalApi({ endpoint: "/batches", requireAuth: true });

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.headers.Authorization).toBe("Bearer token-abc");
  });

  it("does not attach an Authorization header when there is no token", async () => {
    mockCookies(undefined);
    mockFetchOnce({});
    await universalApi({ endpoint: "/public/info" });

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.headers.Authorization).toBeUndefined();
  });

  it("serializes the body only for mutating methods that carry data", async () => {
    mockFetchOnce({});
    await universalApi({
      endpoint: "/batches",
      method: "POST",
      data: { name: "Class 5" },
    });

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.method).toBe("POST");
    expect(options.body).toBe(JSON.stringify({ name: "Class 5" }));
  });

  it("does not set a body for GET requests even if data is passed", async () => {
    mockFetchOnce({});
    await universalApi({
      endpoint: "/batches",
      method: "GET",
      data: { ignored: true },
    });

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.body).toBeUndefined();
  });

  it("flags unauthorized on a 401 response", async () => {
    mockFetchOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: "Session expired" }),
    });

    const result = await universalApi({ endpoint: "/batches" });

    expect(result).toEqual({
      success: false,
      unauthorized: true,
      message: "Session expired",
    });
  });

  it("parses Retry-After on a 429 response", async () => {
    mockFetchOnce({
      ok: false,
      status: 429,
      headers: new Headers({ "Retry-After": "30" }),
      json: async () => ({}),
    });

    const result = await universalApi({ endpoint: "/batches" });

    expect(result).toEqual({
      success: false,
      message: "Too Many Requests",
      retryAfter: 30,
    });
  });

  it("returns a generic failure message for other non-2xx responses", async () => {
    mockFetchOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({}),
    });

    const result = await universalApi({ endpoint: "/batches" });

    expect(result).toEqual({
      success: false,
      message: "Error: Internal Server Error",
    });
  });

  it("catches network errors and returns a friendly message", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("offline"));

    const result = await universalApi({ endpoint: "/batches" });

    expect(result).toEqual({
      success: false,
      message: "Network error. Please try again.",
    });
    consoleSpy.mockRestore();
  });
});
