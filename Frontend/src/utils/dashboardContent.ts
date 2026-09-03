import {
  LayoutDashboard,
  Users,
  UserCog,
  School,
  BookOpen,
  ClipboardCheck,
  FileBarChart,
  GraduationCap,
  UsersRound,
  Layers,
  BookMarked,
  FileText,
  ListChecks,
  FlaskConical,
  FolderKanban,
  UserPlus,
  Presentation,
  CalendarClock,
} from 'lucide-react'
import type {
  NavItem,
  StatCard,
  MiniStatCard,
  ActivityPoint,
  UserSummaryItem,
  QuickAction,
  SystemNotification,
  ActivityLogItem,
  StatusRow,
} from '../types/Dashboard'

export const sidebarNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/super-admin' },
  { icon: Users, label: 'Siswa', href: '/super-admin/siswa' },
  { icon: UserCog, label: 'Guru & Staf', href: '/super-admin/staf' },
  { icon: School, label: 'Kelas & Kurikulum', href: '/super-admin/kelas' },
  { icon: BookOpen, label: 'Mata Pelajaran', href: '/super-admin/mapel' },
  { icon: ClipboardCheck, label: 'Tugas & Assessment', href: '/super-admin/tugas' },
  { icon: FileBarChart, label: 'Laporan & Log', href: '/super-admin/laporan' },
]

export const mainStats: StatCard[] = [
  {
    code: 'MODULE_01',
    label: 'Total Siswa',
    value: '1.248',
    trend: '+52 siswa bulan ini',
    trendTone: 'positive',
    icon: GraduationCap,
  },
  {
    code: 'MODULE_02',
    label: 'Total Guru',
    value: '86',
    trend: '+3 guru bulan ini',
    trendTone: 'positive',
    icon: UsersRound,
  },
  {
    code: 'MODULE_03',
    label: 'Total Kelas',
    value: '42',
    trend: 'Aktif TA 2026/2027',
    trendTone: 'neutral',
    badge: 'Aktif',
    icon: Layers,
    highlighted: true,
  },
  {
    code: 'MODULE_04',
    label: 'Mata Pelajaran',
    value: '68',
    trend: 'Aktif & Terdaftar',
    trendTone: 'neutral',
    badge: 'Kurikulum',
    icon: BookMarked,
  },
]

export const miniStats: MiniStatCard[] = [
  { label: 'Materi Aktif', value: '124', badge: 'Materi', icon: FileText },
  { label: 'Tugas Aktif', value: '86', badge: 'Terjadwal', icon: ListChecks },
  {
    label: 'Assessment Aktif',
    value: '42',
    badge: 'Evaluasi',
    icon: FlaskConical,
    highlighted: true,
  },
  { label: 'Proyek Aktif', value: '18', badge: 'PJ / Tim', icon: FolderKanban },
]

export const activityChart: ActivityPoint[] = [
  { day: 'Sen', value: 828 },
  { day: 'Sel', value: 918 },
  { day: 'Rab', value: 875 },
  { day: 'Kam', value: 1028 },
  { day: 'Jum', value: 953 },
  { day: 'Sab', value: 420 },
  { day: 'Min', value: 280 },
]

export const userSummary: UserSummaryItem[] = [
  { label: 'Siswa Aktif', value: 1156, percentage: 87, tone: 'orange' },
  { label: 'Guru Aktif', value: 81, percentage: 6, tone: 'navy' },
  { label: 'Admin Aktif', value: 4, percentage: 1, tone: 'navy' },
  { label: 'Akun Belum Aktif', value: 93, percentage: 7, tone: 'muted' },
]

export const quickActions: QuickAction[] = [
  { icon: UserPlus, label: 'Tambah Siswa' },
  { icon: Presentation, label: 'Tambah Guru' },
  { icon: School, label: 'Tambah Kelas' },
  { icon: CalendarClock, label: 'Tambah Jadwal' },
]

export const systemNotifications: SystemNotification[] = [
  {
    title: 'Jadwal diperbarui',
    description: 'Kurikulum 11 IPS 3 telah diperbarui hari ini',
    time: '12 menit lalu',
    tone: 'navy',
  },
  {
    title: 'Assessment baru',
    description: 'Terdapat assessment baru yang dibuat oleh guru',
    time: '45 menit lalu',
    tone: 'orange',
  },
  {
    title: 'Sistem pemeliharaan',
    description: 'Pemeliharaan sistem dijadwalkan malam ini (23:00 WIB)',
    time: '1 jam lalu',
    tone: 'muted',
  },
]

export const activityLog: ActivityLogItem[] = [
  {
    actor: 'Budi Santoso',
    action: 'mengumpulkan tugas',
    detail: 'Tugas: Analisis Corpus — Bahasa Indonesia',
    tag: 'Tugas',
    time: '5 menit yang lalu',
    tone: 'orange',
  },
  {
    actor: 'Siti Rahma',
    action: 'menyelesaikan assessment',
    detail: 'Assessment: Evaluasi Rak Matriks — Matematika',
    tag: 'Assessment',
    time: '18 menit yang lalu',
    tone: 'navy',
  },
  {
    actor: 'Andi Pratama',
    action: 'menambahkan materi',
    detail: 'Mata Pelajaran: Algoritma Pemrograman — Informatika',
    tag: 'Materi',
    time: '32 menit yang lalu',
    tone: 'muted',
  },
  {
    actor: 'Rina Wijaya',
    action: 'membuat tugas baru',
    detail: 'Mata Pelajaran: Analytical Exposition — Bahasa Inggris',
    tag: 'Tugas Baru',
    time: '1 jam yang lalu',
    tone: 'success',
  },
  {
    actor: 'Admin',
    action: 'menambahkan siswa baru',
    detail: 'Data siswa baru #573-2345 terdaftar ke kelas X-1',
    tag: 'Data Siswa',
    time: '2 jam yang lalu',
    tone: 'muted',
  },
]

export const statusRows: StatusRow[] = [
  {
    category: 'Tugas & Assessment Aktif',
    count: 128,
    percentage: 25,
    label: 'Aktif',
    tone: 'success',
    action: 'Pantau Kelas',
  },
  {
    category: 'Mendekati Deadline (< 24 jam)',
    count: 24,
    percentage: 5,
    label: 'Deadline Ketat',
    tone: 'warning',
    action: 'Kirim Pengingat',
  },
  {
    category: 'Selesai Dinilai / Terverifikasi',
    count: 342,
    percentage: 67,
    label: 'Tercapai',
    tone: 'success',
    action: 'Unduh Rapor',
  },
  {
    category: 'Terlambat / Belum Dinilai',
    count: 17,
    percentage: 3,
    label: 'Urgent',
    tone: 'danger',
    action: 'Eskalasi ke Guru',
  },
]