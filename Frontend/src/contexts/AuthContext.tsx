import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  login as loginRequest,
  loginAdmin as loginAdminRequest,
  logout as logoutRequest,
  getMe,
} from '../services/authService'
import type { AuthUser, LoginPayload, AdminLoginPayload } from '../types/auth'

interface AuthContextValue {
  user: AuthUser | null
  // isLoading: true SELAMA proses cek sesi awal (panggilan getMe() saat
  // pertama kali app dibuka/direfresh) masih berjalan. Halaman yang butuh
  // proteksi (ProtectedRoute, dsb.) HARUS menunggu ini jadi false sebelum
  // memutuskan redirect ke /login atau tidak — kalau tidak, user yang
  // sebenarnya sudah login bisa sempat ke-redirect ke halaman login
  // karena `user` masih null padahal pengecekan sesi belum selesai.
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  loginAdmin: (payload: AdminLoginPayload) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function restoreSession() {
      try {
        const restoredUser = await getMe()
        if (isMounted) setUser(restoredUser)
      } catch {
        // Gagal di sini artinya belum login / cookie expired / sesi
        // tidak valid — kondisi NORMAL saat pertama buka app, BUKAN error
        // yang perlu ditampilkan ke pengguna.
        if (isMounted) setUser(null)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    restoreSession()
    return () => {
      isMounted = false
    }
  }, [])

  async function login(payload: LoginPayload) {
    const loggedInUser = await loginRequest(payload)
    setUser(loggedInUser)
  }

  async function loginAdmin(payload: AdminLoginPayload) {
    const loggedInUser = await loginAdminRequest(payload)
    setUser(loggedInUser)
  }

  async function logout() {
    try {
      await logoutRequest()
    } finally {
      // State di-clear SELALU, bahkan kalau request ke server gagal (mis.
      // network error) — dari sudut pandang pengguna, klik "Logout" harus
      // tetap mengeluarkan mereka dari UI, jangan sampai macet di state
      // "masih login" hanya gara-gara satu request gagal.
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth harus dipakai di dalam <AuthProvider>')
  }
  return ctx
}

// AuthContext diekspor juga (bukan cuma AuthProvider/useAuth) supaya
// hooks/useAuth.ts bisa re-export dari sini kalau suatu saat perlu
// konsumsi context secara langsung tanpa lewat hook ini.
export { AuthContext }