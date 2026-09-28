import api from './api'
import type { Student } from '../types/Student'

export interface StudentStatsResponse {
  total: number
  active: number
  inactive: number
  totalClasses: number
}

export interface StudentPageResponse {
  stats: StudentStatsResponse
  students: Student[]
}

interface ApiSuccess<T> {
  success: true
  data: T
}

export async function fetchStudentPage(): Promise<StudentPageResponse> {
  const { data } = await api.get<ApiSuccess<StudentPageResponse>>('/api/admin/students')
  return data.data
}

export async function createStudent(payload: Partial<Student>): Promise<Student> {
  const { data } = await api.post<ApiSuccess<Student>>('/api/admin/students', payload)
  return data.data
}

export async function updateStudent(id: string, payload: Partial<Student>): Promise<Student> {
  const { data } = await api.put<ApiSuccess<Student>>(`/api/admin/students/${id}`, payload)
  return data.data
}

export async function deleteStudent(id: string): Promise<void> {
  await api.delete(`/api/admin/students/${id}`)
}
