import api from './api'
import type { GuruDashboardResponse } from '../types/Guru/guruDashboardResponse'
import type { GuruAssignmentsResponse } from '../types/Guru/guruAssignmentResponse'
import type { GuruAssessmentsResponse } from '../types/Guru/guruAssessmentsResponse'

interface ApiSuccess<T> {
  success: true
  data: T
}

export async function getGuruDashboard(): Promise<GuruDashboardResponse> {
  const { data } = await api.get<ApiSuccess<GuruDashboardResponse>>('/api/guru/dashboard')
  return data.data
}

export async function getGuruAssignments(classId?: string): Promise<GuruAssignmentsResponse> {
  const { data } = await api.get<ApiSuccess<GuruAssignmentsResponse>>('/api/guru/assignments', {
    params: classId ? { classId } : undefined,
  })
  return data.data
}

export async function getGuruAssessments(): Promise<GuruAssessmentsResponse> {
  const { data } = await api.get('/api/assessments', {
    params: { view: 'teacher-overview' },
  })
  return data
}

async function downloadBlob(url: string, filename: string) {
  const res = await api.get(url, { responseType: 'blob' })
  const href = URL.createObjectURL(res.data)
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  a.click()
  URL.revokeObjectURL(href)
}

export const downloadAssessmentReport = () =>
  downloadBlob('/api/assessments/report', 'laporan-assessment.pdf')

export const downloadAssessmentRanking = (id: string) =>
  downloadBlob(`/api/assessments/${id}/ranking`, `peringkat-${id}.pdf`)