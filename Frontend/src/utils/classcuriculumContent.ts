import { School, CheckCircle2, CalendarRange, Layers3 } from 'lucide-react'
import type { SchoolClass, Curriculum } from '../types/classcurriculum'
import type { StatCard } from '../types/Dashboard'

export const classSummary = {
  total: 42,
  active: 40,
  academicYear: '2026/2027',
  majorCount: 6,
}

export const classStatsCards: StatCard[] = [
  {
    code: 'DATA_01',
    label: 'Total Kelas',
    value: String(classSummary.total),
    icon: School,
  },
  {
    code: 'DATA_02',
    label: 'Kelas Aktif',
    value: String(classSummary.active),
    icon: CheckCircle2,
    highlighted: true,
    badge: 'Aktif',
  },
  {
    code: 'DATA_03',
    label: 'Tahun Ajaran',
    value: classSummary.academicYear,
    icon: CalendarRange,
  },
  {
    code: 'DATA_04',
    label: 'Program / Jurusan',
    value: String(classSummary.majorCount),
    icon: Layers3,
  },
]

const dummyStudents11ppl1 = [
  { name: 'Farhan Maulana', nis: '241001', nisn: '0071234561', gender: 'L' as const, status: 'aktif' as const },
  { name: 'Nabila Putri', nis: '241002', nisn: '0071234562', gender: 'P' as const, status: 'aktif' as const },
  { name: 'Rizky Ramadhan', nis: '241003', nisn: '0071234563', gender: 'L' as const, status: 'aktif' as const },
  { name: 'Salsa Aulia', nis: '241004', nisn: '0071234564', gender: 'P' as const, status: 'aktif' as const },
  { name: 'Bagas Setiawan', nis: '241005', nisn: '0071234565', gender: 'L' as const, status: 'nonaktif' as const },
]

export const classList: SchoolClass[] = [
  {
    id: 'cls-11ppl1',
    name: '11 PPLG 1',
    grade: 11,
    major: 'PPLG',
    homeroomTeacher: 'Ahmad Fauzan, S.Kom.',
    academicYear: '2026/2027',
    status: 'aktif',
    students: dummyStudents11ppl1,
    subjects: ['Informatika', 'Rekayasa Perangkat Lunak', 'Matematika', 'Bahasa Indonesia', 'Bahasa Inggris'],
  },
  {
    id: 'cls-11ppl2',
    name: '11 PPLG 2',
    grade: 11,
    major: 'PPLG',
    homeroomTeacher: 'Hendra Wijaya, M.T.',
    academicYear: '2026/2027',
    status: 'aktif',
    students: dummyStudents11ppl1.slice(0, 3),
    subjects: ['Informatika', 'Matematika', 'Bahasa Indonesia'],
  },
  {
    id: 'cls-12ppl1',
    name: '12 PPLG 1',
    grade: 12,
    major: 'PPLG',
    homeroomTeacher: 'Maya Rizki, S.Pd.',
    academicYear: '2026/2027',
    status: 'aktif',
    students: dummyStudents11ppl1.slice(0, 4),
    subjects: ['Matematika', 'Rekayasa Perangkat Lunak', 'Bahasa Inggris'],
  },
  {
    id: 'cls-12ppl2',
    name: '12 PPLG 2',
    grade: 12,
    major: 'PPLG',
    homeroomTeacher: 'Hendra Wijaya, M.T.',
    academicYear: '2026/2027',
    status: 'aktif',
    students: dummyStudents11ppl1.slice(0, 5),
    subjects: ['Informatika', 'Rekayasa Perangkat Lunak'],
  },
  {
    id: 'cls-10ips',
    name: '10 IPS',
    grade: 10,
    major: 'IPS',
    homeroomTeacher: 'Siti Rahma, S.Pd.',
    academicYear: '2026/2027',
    status: 'aktif',
    students: dummyStudents11ppl1.slice(0, 2),
    subjects: ['Bahasa Indonesia', 'Seni Budaya Lokal'],
  },
  {
    id: 'cls-11ips',
    name: '11 IPS',
    grade: 11,
    major: 'IPS',
    homeroomTeacher: 'Rina Wijaya',
    academicYear: '2026/2027',
    status: 'aktif',
    students: dummyStudents11ppl1.slice(0, 3),
    subjects: ['Matematika', 'Bahasa Indonesia', 'Bahasa Inggris'],
  },
  {
    id: 'cls-10mplb',
    name: '10 MPLB',
    grade: 10,
    major: 'MPLB',
    homeroomTeacher: 'Dewi Anggraini, S.Si.',
    academicYear: '2026/2027',
    status: 'aktif',
    students: dummyStudents11ppl1.slice(0, 2),
    subjects: ['Matematika', 'Fisika & Sains'],
  },
  {
    id: 'cls-10jkt',
    name: '10 JKT 1',
    grade: 10,
    major: 'JKT',
    homeroomTeacher: '-',
    academicYear: '2025/2026',
    status: 'nonaktif',
    students: [],
    subjects: [],
  },
]

export const curriculumList: Curriculum[] = [
  {
    id: 'kur-01',
    name: 'Kurikulum Merdeka — Kejuruan Informatika',
    academicYear: '2026/2027',
    grade: '10–12',
    major: 'PPLG',
    status: 'aktif',
    subjects: [
      { code: 'INF', name: 'Informatika', group: 'Kejuruan', hoursPerWeek: 6, status: 'aktif' },
      { code: 'RPL', name: 'Rekayasa Perangkat Lunak', group: 'Kejuruan', hoursPerWeek: 8, status: 'aktif' },
      { code: 'MTK', name: 'Matematika', group: 'Umum', hoursPerWeek: 4, status: 'aktif' },
      { code: 'BIN', name: 'Bahasa Indonesia', group: 'Umum', hoursPerWeek: 4, status: 'aktif' },
    ],
  },
  {
    id: 'kur-02',
    name: 'Kurikulum Merdeka — Umum',
    academicYear: '2026/2027',
    grade: '10–12',
    major: 'IPS',
    status: 'aktif',
    subjects: [
      { code: 'MTK', name: 'Matematika', group: 'Umum', hoursPerWeek: 4, status: 'aktif' },
      { code: 'BIN', name: 'Bahasa Indonesia', group: 'Umum', hoursPerWeek: 4, status: 'aktif' },
      { code: 'ENG', name: 'Bahasa Inggris', group: 'Umum', hoursPerWeek: 3, status: 'aktif' },
    ],
  },
  {
    id: 'kur-03',
    name: 'Kurikulum Merdeka — Muatan Lokal',
    academicYear: '2026/2027',
    grade: '10–11',
    major: 'IPS',
    status: 'aktif',
    subjects: [
      { code: 'MLK', name: 'Seni Budaya Lokal', group: 'Muatan Lokal', hoursPerWeek: 2, status: 'aktif' },
    ],
  },
  {
    id: 'kur-04',
    name: 'Kurikulum 2013 — Jaringan Komputer',
    academicYear: '2025/2026',
    grade: '11–12',
    major: 'JKT',
    status: 'nonaktif',
    subjects: [
      { code: 'JKT', name: 'Teknisi & Jaringan Komputer', group: 'Kejuruan', hoursPerWeek: 8, status: 'nonaktif' },
    ],
  },
]