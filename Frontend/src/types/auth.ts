export type Role =
  | "super_admin"
  | "admin"
  | "guru"
  | "murid"
  | "kurikulum"
  | "kepala_sekolah";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  adminId?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginPayload {
  adminId: string;
  password: string;
}