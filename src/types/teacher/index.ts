import type { Gender } from "@/types/shared";
import type { AuthUser } from "@/types/auth";

export interface Teacher {
  id: string;
  userId: string;
  instituteId: string;
  name: string;
  gender: Gender;
  education: string;
  phone: string;
  address: string;
  user?: Pick<AuthUser, "id" | "email" | "phone" | "role">;
}

export interface RegisterTeacherInput {
  name: string;
  email: string;
  password: string;
  gender: Gender;
  education: string;
  phone: string;
  address: string;
}
