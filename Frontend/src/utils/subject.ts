import { BookMarked, CheckCircle2, Layers, UsersRound } from 'lucide-react'
import type { Subject, SubjectGroup } from '../types/subject'
import type { StatCard } from '../types/Dashboard'

export const groupLabel: Record<SubjectGroup, string> = {
  umum: 'Umum',
  kejuruan: 'Kejuruan',
  muatan_lokal: 'Muatan Lokal',
}

export const subjectSummary = {
  total: 68,
  active: 64,
  groupCount: 8,
  teacherCount: 86,
}

export const subjectStatsCards: StatCard[] = [
  {
    code: 'DATA_01',
    label: 'Total Mata Pelajaran',
    value: String(subjectSummary.total),
    icon: BookMarked,
  },
  {
    code: 'DATA_02',
    label: 'Mata Pelajaran Aktif',
    value: String(subjectSummary.active),
    icon: CheckCircle2,
    highlighted: true,
    badge: 'Aktif',
  },
  {
    code: 'DATA_03',
    label: 'Kelompok Mata Pelajaran',
    value: String(subjectSummary.groupCount),
    icon: Layers,
  },
  {
    code: 'DATA_04',
    label: 'Guru Pengajar',
    value: String(subjectSummary.teacherCount),
    icon: UsersRound,
  },
]

export const subjectList: Subject[] = [
  {
    id: 'sub-inf',
    code: 'INF',
    name: 'Informatika',
    group: 'kejuruan',
    grades: [10, 11, 12],
    status: 'aktif',
    description:
      'Mata pelajaran produktif kejuruan yang membekali siswa dengan dasar pemrograman, logika komputasi, dan pengembangan perangkat lunak.',
    teachers: [
      { name: 'Ahmad Fauzan, S.Kom.', nip: '198905122015012002', classes: ['11 PPLG 1', '11 PPLG 2'] },
      { name: 'Hendra Wijaya, M.T.', nip: '198502142018011003', classes: ['12 PPLG 2'] },
    ],
    classes: ['10 PPLG 1', '10 PPLG 2', '11 PPLG 1', '11 PPLG 2', '12 PPLG 1', '12 PPLG 2'],
    curriculums: ['Kurikulum Merdeka — Kejuruan Informatika 2026/2027'],
  },
  {
    id: 'sub-mtk',
    code: 'MTK',
    name: 'Matematika',
    group: 'umum',
    grades: [10, 11, 12],
    status: 'aktif',
    description:
      'Mata pelajaran wajib yang mencakup aljabar, geometri, statistika, dan kalkulus dasar sesuai fase capaian pembelajaran.',
    teachers: [
      { name: 'Maya Rizki, S.Pd.', nip: '199903122017082006', classes: ['10 PPLG 1', '12 PPLG 2'] },
    ],
    classes: ['10 PPLG 1', '10 MPLB', '11 IPS', '12 PPLG 1', '12 PPLG 2'],
    curriculums: ['Kurikulum Merdeka — Umum 2026/2027'],
  },
  {
    id: 'sub-bin',
    code: 'BIN',
    name: 'Bahasa Indonesia',
    group: 'umum',
    grades: [10, 11, 12],
    status: 'aktif',
    description:
      'Mata pelajaran wajib yang berfokus pada kemampuan literasi, menulis, dan berbicara dalam Bahasa Indonesia.',
    teachers: [
      { name: 'Siti Rahma, S.Pd.', nip: '199104182016022003', classes: ['10 IPS', '11 IPS'] },
    ],
    classes: ['10 IPS', '11 IPS', '12 IPS'],
    curriculums: ['Kurikulum Merdeka — Umum 2026/2027'],
  },
  {
    id: 'sub-rpl',
    code: 'RPL',
    name: 'Rekayasa Perangkat Lunak',
    group: 'kejuruan',
    grades: [11, 12],
    status: 'aktif',
    description:
      'Mata pelajaran produktif kejuruan yang membahas siklus pengembangan perangkat lunak dan praktik rekayasa perangkat lunak.',
    teachers: [
      { name: 'Hendra Wijaya, M.T.', nip: '198502142018011003', classes: ['12 PPLG 2'] },
    ],
    classes: ['11 PPLG 1', '12 PPLG 2'],
    curriculums: ['Kurikulum Merdeka — Kejuruan Informatika 2026/2027'],
  },
  {
    id: 'sub-fis',
    code: 'FIS',
    name: 'Fisika & Sains',
    group: 'umum',
    grades: [10],
    status: 'aktif',
    description:
      'Mata pelajaran peminatan yang memperkenalkan konsep dasar fisika dan metode ilmiah untuk kelas 10.',
    teachers: [
      { name: 'Dewi Anggraini, S.Si.', nip: '199401202020122008', classes: ['10 PPLG', '10 MPLB'] },
    ],
    classes: ['10 PPLG', '10 MPLB'],
    curriculums: ['Kurikulum Merdeka — Umum 2026/2027'],
  },
  {
    id: 'sub-eng',
    code: 'ENG',
    name: 'Bahasa Inggris',
    group: 'umum',
    grades: [10, 11, 12],
    status: 'aktif',
    description:
      'Mata pelajaran wajib yang menekankan kemampuan komunikasi lisan dan tulisan dalam Bahasa Inggris, termasuk analytical exposition.',
    teachers: [
      { name: 'Rina Wijaya', nip: '199208102018012004', classes: ['11 IPS'] },
    ],
    classes: ['10 IPS', '11 IPS', '12 IPS'],
    curriculums: ['Kurikulum Merdeka — Umum 2026/2027'],
  },
  {
    id: 'sub-jkt',
    code: 'JKT',
    name: 'Teknisi & Jaringan Komputer',
    group: 'kejuruan',
    grades: [11, 12],
    status: 'nonaktif',
    description:
      'Mata pelajaran produktif kejuruan bidang jaringan komputer, saat ini nonaktif menunggu pembaruan kurikulum.',
    teachers: [],
    classes: [],
    curriculums: [],
  },
  {
    id: 'sub-mlk',
    code: 'MLK',
    name: 'Seni Budaya Lokal',
    group: 'muatan_lokal',
    grades: [10, 11],
    status: 'aktif',
    description:
      'Muatan lokal yang memperkenalkan kesenian dan budaya daerah sebagai bagian dari penguatan karakter siswa.',
    teachers: [
      { name: 'Budi Santoso', nip: '198703152014031001', classes: ['10 IPS'] },
    ],
    classes: ['10 IPS', '11 IPS'],
    curriculums: ['Kurikulum Merdeka — Muatan Lokal 2026/2027'],
  },
]