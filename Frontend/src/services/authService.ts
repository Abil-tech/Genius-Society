import api, { isApiError } from "./api";
import type { AuthUser, LoginPayload, AdminLoginPayload } from "../types/auth";

interface ApiSuccess<T> {
  success: true;
  data: T;
}

export async function login(payload: LoginPayload): Promise<AuthUser> {
  const { data } = await api.post<ApiSuccess<{ user: AuthUser }>>(
    "/api/auth/login",
    payload
  );
  return data.data.user;
}

export async function loginAdmin(payload: AdminLoginPayload): Promise<AuthUser> {
  const { data } = await api.post<ApiSuccess<{ user: AuthUser }>>(
    "/api/auth/admin-login",
    payload
  );
  return data.data.user;
}

export async function logout(): Promise<void> {
  await api.post("/api/auth/logout");
}

// getMe: dipakai untuk memulihkan sesi saat halaman di-refresh. Bentuk
// response backend SEKARANG sama persis dengan login()/loginAdmin() —
// { user: AuthUser } — bukan lagi { userId, role } yang tidak lengkap.
export async function getMe(): Promise<AuthUser> {
  const { data } = await api.get<ApiSuccess<{ user: AuthUser }>>(
    "/api/auth/me"
  );
  return data.data.user;
}

export { isApiError };