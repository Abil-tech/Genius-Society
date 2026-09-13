import api, { isApiError } from "./api";
import type { AuthUser, LoginPayload, AdminLoginPayload, Role } from "../types/auth";

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

export async function getMe(): Promise<{ userId: string; role: Role }> {
  const { data } = await api.get<ApiSuccess<{ userId: string; role: Role }>>(
    "/api/auth/me"
  );
  return data.data;
}

export { isApiError };