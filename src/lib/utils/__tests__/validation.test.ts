import {
  loginSchema,
  studentLoginSchema,
  registerParentSchema,
} from "@/lib/utils/validation";

describe("loginSchema", () => {
  it("accepts an email + password", () => {
    const r = loginSchema.safeParse({ email: "a@b.com", phone: "", password: "x" });
    expect(r.success).toBe(true);
  });

  it("accepts a phone + password", () => {
    const r = loginSchema.safeParse({ email: "", phone: "0123456", password: "x" });
    expect(r.success).toBe(true);
  });

  it("rejects when neither email nor phone is given", () => {
    const r = loginSchema.safeParse({ email: "", phone: "", password: "x" });
    expect(r.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const r = loginSchema.safeParse({ email: "a@b.com", phone: "", password: "" });
    expect(r.success).toBe(false);
  });
});

describe("studentLoginSchema", () => {
  it("accepts a valid code", () => {
    expect(studentLoginSchema.safeParse({ studentCode: "STU-ABCD2345" }).success).toBe(true);
  });
  it("rejects a too-short code", () => {
    expect(studentLoginSchema.safeParse({ studentCode: "ab" }).success).toBe(false);
  });
});

describe("registerParentSchema", () => {
  const valid = {
    name: "Amina",
    email: "amina@example.com",
    password: "secret6",
    phone: "01700000000",
    profession: "Teacher",
    address: "12 Rose St",
    emergencyContact: "01800000000",
  };

  it("accepts a complete valid payload", () => {
    expect(registerParentSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a short password", () => {
    expect(registerParentSchema.safeParse({ ...valid, password: "123" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(registerParentSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
  });
});
