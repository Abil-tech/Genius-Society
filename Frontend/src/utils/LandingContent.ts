import {
  Users,
  Lightbulb,
  MonitorPlay,
  ClipboardList,
  ShieldCheck,
  LineChart,
  MessagesSquare,
  Award,
} from 'lucide-react'
import type { FeatureItem, StatItem } from '../types/Landing'

export const heroStats: StatItem[] = [
  {
    icon: Users,
    value: '3000+',
    label: 'Siswa Aktif',
  },
  {
    icon: Lightbulb,
    value: '150+',
    label: 'Guru Ahli',
  },
]

export const features: FeatureItem[] = [
  {
    icon: MonitorPlay,
    iconBg: 'bg-brand-orange-light',
    iconColor: 'text-brand-orange',
    title: 'Interactive Learning',
    description:
      'Materi interaktif dengan integrasi multimedia untuk meningkatkan pemahaman siswa.',
  },
  {
    icon: ClipboardList,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: 'Assignment Management',
    description:
      'Pengelolaan tugas terstruktur dengan tenggat waktu dan notifikasi otomatis.',
  },
  {
    icon: ShieldCheck,
    iconBg: 'bg-brand-orange-light',
    iconColor: 'text-brand-orange',
    title: 'Online Assessment',
    description:
      'Sistem ujian online terintegrasi dengan berbagai tipe soal dan anti-kecurangan.',
  },
  {
    icon: LineChart,
    iconBg: 'bg-brand-orange-light',
    iconColor: 'text-brand-orange',
    title: 'Learning Analytics',
    description:
      'Pantau perkembangan akademik siswa dengan laporan komprehensif dan real-time.',
  },
  {
    icon: MessagesSquare,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: 'Discussion Forum',
    description:
      'Ruang kolaborasi siswa dan guru untuk tanya jawab dan diskusi materi.',
  },
  {
    icon: Award,
    iconBg: 'bg-brand-orange-light',
    iconColor: 'text-brand-orange',
    title: 'Digital Certificate',
    description:
      'Sertifikat digital otomatis bagi siswa yang menyelesaikan modul kompeten.',
  },
]

export const footerLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'FAQ', href: '#' },
  { label: 'Support', href: '#' },
]