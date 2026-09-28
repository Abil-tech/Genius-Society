import api from './api'
import type { GuruDashboardResponse } from '../types/Guru/guruDashboardResponse'
import type { GuruAssignmentsResponse } from '../types/Guru/guruAssignmentResponse'

interface ApiSuccess<T> {
  success: true
  data: T
}

export async function getGuruDashboard(): Promise<GuruDashboardResponse> {
  const { data } = await api.get<ApiSuccess<GuruDashboardResponse>>('/api/guru/dashboard')
  return data.data
}

export async function getGuruAssignments(classId?: string): Promise<GuruAssignmentsResponse> {
  const { data } = await api.get('/api/assignments', {
    params: { classId: classId || undefined, view: 'teacher-overview' },
  })
  return data
}