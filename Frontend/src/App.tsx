import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import SuperAdminDashboardPage from './pages/SuperAdminDashboardPage'
import ProtectedRoute from './routes/ProtectedRoute'

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
      <GlobalAuthListener />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminDashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App