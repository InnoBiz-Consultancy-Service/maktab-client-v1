import { ApiError } from "@/lib/api/errors";

describe("ApiError", () => {
  it("carries the status code and message", () => {
    const err = new ApiError(404, "Not found");
    expect(err.status).toBe(404);
    expect(err.message).toBe("Not found");
  });

  it("is a real Error instance with the right name", () => {
    const err = new ApiError(500, "Server error");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("ApiError");
  });
});
