import {
  GraduationCap,
  UsersRound,
  Layers,
  BookMarked,
  FileText,
  ListChecks,
  FlaskConical,
  FolderKanban,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react'

// iconMap: Pemetaan SATU ARAH dari string key → komponen Lucide. Disimpan
// di satu tempat supaya mudah di-maintain dan konsisten di seluruh app
// (landing page, dashboard, sidebar, dsb.) — kalau mau tambah icon baru
// atau ubah referensi, cukup edit di sini.
//
// PENTING: semua string yang mungkin dikirim backend WAJIB ada di sini
// sebagai key, dengan value yang tepat. Kalau backend kirim key yang tidak
// ada di map ini, hasilnya jadi fallback icon (AlertCircle) yang membuat
// UI terlihat rusak. Cek log console jika ada peringatan di dev.
export const iconMap: Record<string, LucideIcon> = {
  // Main stats / Mini stats
  GraduationCap,
  UsersRound,
  Layers,
  BookMarked,
  FileText,
  ListChecks,
  FlaskConical,
  FolderKanban,

  // Trends & activity
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,

  // UI/navigation
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
}

// getIcon: mengambil komponen Lucide dari string key. Kalau key tidak ada,
// log warning dan kembalikan fallback AlertCircle (icon "?" universal)
// — ini lebih baik daripada crash, tapi menunjukkan bug di backend/type.
export function getIcon(key: string): LucideIcon {
  const icon = iconMap[key]
  if (!icon) {
    console.warn(`Icon key not found: "${key}", using fallback AlertCircle`)
    return AlertCircle
  }
  return icon
}