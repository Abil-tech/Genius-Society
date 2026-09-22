import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

/**
 * Bentuk response error standar dari backend (Gin).
 * Sesuaikan field ini kalau format error handler backend berbeda.
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Error yang sudah dinormalisasi, dipakai di seluruh service/komponen
 * supaya tidak perlu berurusan dengan bentuk AxiosError langsung.
 */
export interface ApiError {
  status: number | null;
  message: string;
  errors?: Record<string, string[]>;
  isNetworkError: boolean;
}

const baseURL = import.meta.env.VITE_API_URL as string | undefined;

if (!baseURL) {
  // Gagal cepat saat development kalau env belum di-set, daripada
  // request diam-diam jalan ke path relatif yang salah.
  // eslint-disable-next-line no-console
  console.error(
    "[api] VITE_API_URL belum di-set. Cek file .env berdasarkan .env.example."
  );
}

const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true, // WAJIB: JWT dikirim via HTTP-only cookie, BUKAN header Authorization / localStorage.
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---- Request interceptor ----
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Tempat menambahkan header umum di masa depan (mis. X-Request-Id, locale, dsb).
    // JANGAN pernah menambahkan Authorization: Bearer <token> di sini —
    // auth sepenuhnya ditangani oleh HTTP-only cookie (lihat prompt bagian 5 & 23).
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// ---- Response interceptor ----
let unauthorizedEventInFlight = false;

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status ?? null;
    const backendMessage = error.response?.data?.message;
    const backendErrors = error.response?.data?.errors;

    const normalized: ApiError = {
      status,
      isNetworkError: status === null,
      message:
        backendMessage ??
        (status === null
          ? "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
          : "Terjadi kesalahan pada server. Silakan coba lagi."),
      errors: backendErrors,
    };

    if (status === 401) {
      // Session invalid/expired (cookie hilang atau JWT kedaluwarsa).
      // Jangan redirect langsung di sini — biar api.ts tetap tidak tahu
      // apa-apa soal routing. Broadcast event, biar AuthContext/App yang
      // memutuskan (clear state user, arahkan ke /login, dst).
      if (!unauthorizedEventInFlight) {
        unauthorizedEventInFlight = true;
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        queueMicrotask(() => {
          unauthorizedEventInFlight = false;
        });
      }
    } else if (status === 403) {
      // Permission ditolak backend (RBAC). Biarkan komponen pemanggil
      // menampilkan pesan spesifik, tapi tetap broadcast untuk kasus global
      // (mis. toast generik "Akses ditolak").
      window.dispatchEvent(
        new CustomEvent("auth:forbidden", { detail: normalized })
      );
    }

    return Promise.reject(normalized);
  }
);

/** Type guard untuk dipakai di blok catch service/komponen. */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  );
}

export default api;

/**
 * Contoh pemakaian di service lain (mis. landingService.ts, studentService.ts):
 *
 *   import api, { isApiError } from "./api";
 *
 *   export async function getStudents(params?: { page?: number; search?: string }) {
 *     try {
 *       const { data } = await api.get("/api/students", { params });
 *       return data;
 *     } catch (error) {
 *       if (isApiError(error)) throw error; // sudah dinormalisasi, tinggal ditangani UI
 *       throw error;
 *     }
 *   }
 *
 * Contoh listener global di App.tsx / AuthContext.tsx:
 *
 *   useEffect(() => {
 *     const handleUnauthorized = () => {
 *       clearUser();
 *       navigate("/login", { replace: true });
 *     };
 *     window.addEventListener("auth:unauthorized", handleUnauthorized);
 *     return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
 *   }, []);
 */