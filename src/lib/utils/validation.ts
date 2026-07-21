import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().min(6).max(20).optional().or(z.literal("")),
    password: z.string().min(1, "Enter your password"),
  })
  .refine((v) => Boolean(v.email) || Boolean(v.phone), {
    message: "Enter an email or a phone number",
    path: ["email"],
  });
export type LoginInput = z.infer<typeof loginSchema>;

export const studentLoginSchema = z.object({
  studentCode: z.string().min(4, "Enter your student code").max(30),
});
export type StudentLoginInput = z.infer<typeof studentLoginSchema>;

export const registerParentSchema = z.object({
  name: z.string().min(2, "Name is too short").max(100),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
  phone: z.string().min(6, "Enter a valid phone").max(20),
  profession: z.string().min(2).max(100),
  address: z.string().min(2).max(255),
  emergencyContact: z.string().min(6).max(20),
});
export type RegisterParentInput = z.infer<typeof registerParentSchema>;

export const registerTeacherSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["MALE", "FEMALE"], { message: "Select a gender" }),
  education: z
    .string()
    .min(2, "Education must be at least 2 characters")
    .max(150, "Education is too long"),
  phone: z
    .string()
    .min(6, "Enter a valid phone number")
    .max(20, "Phone is too long"),
  address: z
    .string()
    .min(2, "Address must be at least 2 characters")
    .max(255, "Address is too long"),
});
export type RegisterTeacherInput = z.infer<typeof registerTeacherSchema>;

// ---- Student creation (by an institute). Mirrors POST /api/v1/students ----

/** Inline parent — only used when the parent doesn't exist yet (Path 2). */
export const newParentSchema = z.object({
  name: z.string().min(2, "Parent name must be at least 2 characters").max(100),
  email: z.string().email("Enter a valid parent email"),
  phone: z.string().min(6, "Enter a valid phone number").max(20),
  relation: z
    .string()
    .min(2, "Relation must be at least 2 characters")
    .max(50, "Relation is too long"),
});
export type NewParentInput = z.infer<typeof newParentSchema>;

const studentBase = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  class: z.string().min(1, "Enter a class").max(50, "Class is too long"),
  dob: z.coerce.date({ message: "Enter a valid date of birth" }),
  joinDate: z.coerce.date({
    message: "Enter a valid join date",
  }),
  address: z
    .string()
    .min(1, "Enter an address")
    .max(500, "Address must not exceed 500 characters"),

  medicalConditions: z
    .string()
    .max(500, "Medical conditions must not exceed 500 characters")
    .optional()
    .or(z.literal("")),

  medications: z
    .string()
    .max(500, "Medications must not exceed 500 characters")
    .optional()
    .or(z.literal("")),

  additionalNotes: z
    .string()
    .max(1000, "Additional notes must not exceed 1000 characters")
    .optional()
    .or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE"], { message: "Select a gender" }),
  allergies: z.string().max(255, "Too long").optional().or(z.literal("")),
  photoConsent: z.boolean(),
  teacherId: z.string().min(1, "Select a teacher"),
});

/**
 * The backend requires EXACTLY ONE of `parentId` (existing parent) or `parent`
 * (create a new one inline). This refine enforces that on the client too, so
 * the user gets a clear message instead of a 400 from the API.
 */
export const createStudentSchema = studentBase
  .extend({
    parentId: z.string().optional(),
    parent: newParentSchema.optional(),
  })
  .refine((v) => Boolean(v.parentId) !== Boolean(v.parent), {
    message: "Select an existing parent, or add a new one — not both.",
    path: ["parentId"],
  });
export type CreateStudentInput = z.infer<typeof createStudentSchema>;

// ---- Batches (classes). Mirrors POST/PATCH /api/v1/batches ----

export const createBatchSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(150, "Name is too long"),
  teacherIds: z.array(z.string()).min(1).optional(),
  studentIds: z.array(z.string()).min(1).optional(),
});
export type CreateBatchInput = z.infer<typeof createBatchSchema>;

export const updateBatchSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(150, "Name is too long"),
});
export type UpdateBatchInput = z.infer<typeof updateBatchSchema>;

/** Used for both assign and unassign — at least one id is required either way. */
export const batchTeacherIdsSchema = z.object({
  teacherIds: z.array(z.string()).min(1, "Select at least one teacher"),
});
export const batchStudentIdsSchema = z.object({
  studentIds: z.array(z.string()).min(1, "Select at least one student"),
});
