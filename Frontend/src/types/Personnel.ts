import type { LucideIcon } from 'lucide-react'

export interface PersonnelStat {
  code: string
  label: string
  value: string
  icon: LucideIcon
  highlighted?: boolean
  topBadge?: string
  trend?: string
  secondary?: {
    value: string
    label: string
  }
  note?: string
}

export type PersonnelType = 'guru' | 'staf'
export type PersonnelStatus = 'aktif' | 'nonaktif'

export interface Personnel {
  nip: string
  name: string
  email: string
  initials: string
  avatarTone: 'orange' | 'red' | 'blue' | 'purple' | 'pink'
  type: PersonnelType
  role: string
  assignment: string
  homeroom: {
    isHomeroom: boolean
    className?: string
  }
  status: PersonnelStatus
}