import api from './api'

export interface ClassResponse {
  id: string
  name: string
  grade: number
  major: string
  academic_year: string
  homeroom_teacher: string
  capacity: number
  status: string
}

export interface ClassPageResponse {
  classes: ClassResponse[]
  total: number
}

interface ApiSuccess<T> {
  success: true
  data: T
}

export async function fetchClasses(): Promise<ClassPageResponse> {
  const { data } = await api.get<ApiSuccess<ClassPageResponse>>('/api/admin/classes')
  return data.data
}
