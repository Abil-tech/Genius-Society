import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import SuperAdminDashboardPage from './pages/SuperAdminDashboardPage'
import GuruStafPage from './pages/GuruStafPage'
import ProtectedRoute from './routes/ProtectedRoute'
import MataPelajaranPage from './pages/MataPelajaranPage'
import KelasKurikulumPage from './pages/KelasKurikulumPage'
import SiswaPage from './pages/SiswaPages'
import ManagementTugasPage from './pages/ManagementTugasPage'
import GuruDashboardPage from './pages/Guru/GuruDashboard'
import JadwalMengajarPage from './pages/Guru/JadwalMengajarPage'
import GuruAssignmentTugas from './pages/Guru/GuruAssignmentTugas'
import GuruAssessmentsPage from './pages/Guru/GuruAssessmentsPage'
import CreateAssessmentPage from './pages/Guru/CreateAssessmentPage'

// Komponen terpisah karena useNavigate() HARUS dipanggil oleh komponen
// yang berada DI DALAM <BrowserRouter>, bukan yang me-render BrowserRouter
// itu sendiri. Menaruh hook ini langsung di App() akan throw runtime error.
function GlobalAuthListener() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleUnauthorized = () => {
      navigate('/login', { replace: true })
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [navigate])

  return null
}

function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider WAJIB membungkus seluruh Routes, karena useAuth()
          dipakai di banyak halaman/komponen (AdminSidebar, LoginPage,
          AdminLoginPage, ProtectedRoute, dst). Tanpa ini, semua pemanggil
          useAuth() akan throw "harus dipakai di dalam <AuthProvider>". */}
      <AuthProvider>
        <GlobalAuthListener />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route
            path="/super-admin/dashboard"
            element={<SuperAdminDashboardPage />
              // <ProtectedRoute allowedRoles={['super_admin']}>
              //   <SuperAdminDashboardPage />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/staf"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <GuruStafPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/mapel"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MataPelajaranPage />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/kelas-kurikulum"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <KelasKurikulumPage />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/siswa"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SiswaPage />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/tugas"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManagementTugasPage />
              </ProtectedRoute>
            }
          />
          
          
          <Route
            path="/guru/dashboard"
            element={
              <ProtectedRoute allowedRoles={['guru']}>
                <GuruDashboardPage />
              </ProtectedRoute>
            }
          />

           <Route
            path="/guru/jadwal"
            element={
              <ProtectedRoute allowedRoles={['guru']}>
                <JadwalMengajarPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guru/materi-tugas"
            element={
              <ProtectedRoute allowedRoles={['guru']}>
                <GuruAssignmentTugas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guru/assessment"
            element={
              <ProtectedRoute allowedRoles={['guru']}>
                <GuruAssessmentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guru/assessment/new"
            element={
              <ProtectedRoute allowedRoles={['guru']}>
                <CreateAssessmentPage />
              </ProtectedRoute>
            }
          />
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App