import api from './api'
import type { Personnel } from '../types/Personnel'

// Bentuk response backend (internal/dto/personnel_dto.go) — dijaga
// terpisah dari tipe Personnel di frontend supaya jelas mana yang
// "kontrak API" vs "tipe yang dipakai komponen UI", walau isinya
// kebetulan sama persis saat ini.
interface PersonnelStatsResponse {
  totalGuru: number
  totalStaf: number
  guruAktif: number
  stafAktif: number
  guruAktifRate: number
  stafAktifRate: number
}

interface PersonnelPageResponse {
  stats: PersonnelStatsResponse
  personnel: Personnel[]
}

interface ApiSuccess<T> {
  success: true
  data: T
}

export async function fetchPersonnelPage(): Promise<PersonnelPageResponse> {
  const { data } = await api.get<ApiSuccess<PersonnelPageResponse>>('/api/admin/personnel')
  return data.data
}

// --- CRUD operations ---

export interface CreatePersonnelPayload {
  name: string
  email: string
  role: 'guru' | 'kurikulum' | 'kepala_sekolah'
  nip?: string
  status: 'aktif' | 'nonaktif'
  subject?: string
  classes?: string[]
}

export async function createPersonnel(payload: CreatePersonnelPayload): Promise<Personnel> {
  const { data } = await api.post<ApiSuccess<Personnel>>('/api/admin/personnel', payload)
  return data.data
}

export interface UpdatePersonnelPayload {
  name: string
  email: string
  nip?: string
  status: 'aktif' | 'nonaktif'
  subject?: string
  classes?: string[]
}

export async function updatePersonnel(
  id: string,
  payload: UpdatePersonnelPayload
): Promise<Personnel> {
  const { data } = await api.put<ApiSuccess<Personnel>>(
    `/api/admin/personnel/${id}`,
    payload
  )
  return data.data
}

export async function deletePersonnel(id: string): Promise<void> {
  await api.delete(`/api/admin/personnel/${id}`)
}