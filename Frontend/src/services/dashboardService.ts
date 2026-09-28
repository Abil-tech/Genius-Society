import api from './api'
import { transformAdminDashboard } from '../utils/dashboardTransform'
import type { AdminDashboardPage, BackendAdminDashboardResponse } from '../utils/dashboardTransform'

interface ApiSuccess<T> {
  success: true
  data: T
}

// getDashboard: fetch admin dashboard dari backend, transform ke frontend
// types, dan kembalikan. Kalau ada error, throws — pemanggil (component)
// yang handle error di try-catch.
export async function getDashboard(): Promise<AdminDashboardPage> {
  const { data } = await api.get<ApiSuccess<BackendAdminDashboardResponse>>(
    '/api/admin/dashboard'
  )
  return transformAdminDashboard(data.data)
}