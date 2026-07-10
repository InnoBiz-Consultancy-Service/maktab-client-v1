import type { Role } from "@/types/shared";

export type { Role };

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string | null;
  phone: string | null;
  role: Role;
  isActive?: boolean;
}

export interface AuthStudent {
  id: string;
  name: string;
  class: string;
}

export interface UserLoginResponse extends AuthTokens {
  user: AuthUser;
}

export interface StudentLoginResponse extends AuthTokens {
  student: AuthStudent;
}

/** Small session persisted in an httpOnly cookie so the UI knows who's in. */
export type Session =
  | { kind: "user"; id: string; role: Exclude<Role, "STUDENT">; label: string }
  | { kind: "student"; id: string; role: "STUDENT"; label: string };
