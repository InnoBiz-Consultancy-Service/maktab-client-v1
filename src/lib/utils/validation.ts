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
