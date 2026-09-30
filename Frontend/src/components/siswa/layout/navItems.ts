import { CalendarDays, ClipboardCheck, ClipboardList, LayoutDashboard, BarChart3 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
}

// Lima item sesuai desain. Materi, Projek, dan Ranking belum punya jalur akses.
export const studentNav: NavItem[] = [
  { label: 'Dashboard', to: '/student', icon: LayoutDashboard, end: true },
  { label: 'Jadwal', to: '/student/jadwal', icon: CalendarDays },
  { label: 'Tugas', to: '/student/tugas', icon: ClipboardList },
  { label: 'Asesmen', to: '/student/asesmen', icon: ClipboardCheck },
  { label: 'Nilai', to: '/student/nilai', icon: BarChart3 },
]
