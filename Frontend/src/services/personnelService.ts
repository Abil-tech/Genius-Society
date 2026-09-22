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

export async function fetchPersonnelPage(): Promise<PersonnelPageResponse> {
  const { data } = await api.get<PersonnelPageResponse>('/admin/personnel')
  return data
}