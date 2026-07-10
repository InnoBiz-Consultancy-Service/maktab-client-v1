import type { AuthUser } from "@/types/auth";

export interface Institute {
  id: string;
  userId: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  logo: string | null;
  isActive: boolean;
  user?: Pick<AuthUser, "id" | "email" | "phone" | "role" | "isActive">;
}

export interface CreateInstituteInput {
  name: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  logo?: string;
}

export interface UpdateInstituteInput {
  name?: string;
  address?: string;
  phone?: string;
  logo?: string;
}
