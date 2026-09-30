import { createBrowserRouter, Link, Navigate } from 'react-router-dom'
import StudentLayout from '../layouts/StudentLayout'
import DashboardPage from '../pages/student/DashboardPage'
import PlaceholderPage from '../pages/student/PlaceholderPage'

// Catatan: belum ada route guard karena /api/auth/me belum ada. Saat backend siap,
// bungkus /student dengan ProtectedRoute. Validasi izin tetap wajib di backend.
export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/student" replace /> },
  {
    path: '/student',
    element: <StudentLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'jadwal', element: <PlaceholderPage title="Jadwal" /> },
      { path: 'tugas', element: <PlaceholderPage title="Tugas" /> },
      { path: 'asesmen', element: <PlaceholderPage title="Asesmen" /> },
      { path: 'nilai', element: <PlaceholderPage title="Nilai" /> },
      { path: 'notifikasi', element: <PlaceholderPage title="Notifikasi" /> },
    ],
  },
  {
    path: '*',
    element: (
      <main className="grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">Halaman tidak ditemukan</h1>
          <Link to="/student" className="mt-3 inline-block underline">
            Kembali ke dashboard
          </Link>
        </div>
      </main>
    ),
  },
])
