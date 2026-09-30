import type { StudentDashboard, StudentProfile } from '../types/student'
import { mockDashboard, mockProfile, mockUnreadCount } from './mockStudentData'

// Komponen UI hanya memanggil fungsi di file ini. Saat backend siap, ganti isi
// fungsi dengan Axios (lihat ./http.ts), contoh:
//   const { data } = await http.get<StudentDashboard>('/api/dashboard/student')
//   return data
// Komponen tidak perlu diubah.

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms))

/** Pengganti GET /api/auth/me */
export async function getCurrentStudent(): Promise<StudentProfile> {
  await delay(150)
  return mockProfile
}

/** Pengganti GET /api/notifications (unread count) */
export async function getUnreadNotificationCount(): Promise<number> {
  await delay(150)
  return mockUnreadCount
}

/** Pengganti endpoint dashboard murid (agregasi tugas, assessment, grades, notifikasi) */
export async function getStudentDashboard(): Promise<StudentDashboard> {
  await delay()
  return mockDashboard
}
