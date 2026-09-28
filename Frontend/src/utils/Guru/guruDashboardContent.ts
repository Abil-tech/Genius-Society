import type {
  GuruSummary,
  TodaySchedule,
  GuruActiveTask,
  PendingSubmission,
  GuruActiveAssessment,
  StudentActivity,
  GuruAnnouncement,
  HomeroomClass,
} from '../../types/Guru/guruDashboard'

// TODO: ganti seluruh isi file ini dengan hasil GET /api/guru/dashboard.
// Struktur data sengaja dipisah per section supaya gampang dipetakan ke
// response API tanpa perlu ubah komponen.

export const guruSummary: GuruSummary = {
  totalClasses: 4,
  totalSubjects: 2,
  activeTasks: 6,
  pendingGrading: 9,
}

export const todaySchedules: TodaySchedule[] = [
  {
    id: 'sch-1',
    startTime: '07:30',
    endTime: '09:00',
    subject: 'Informatika',
    className: '11 PPLG 1',
    room: 'Lab Komputer 1',
    status: 'selesai',
  },
  {
    id: 'sch-2',
    startTime: '09:15',
    endTime: '10:45',
    subject: 'Informatika',
    className: '11 PPLG 2',
    room: 'Lab Komputer 1',
    status: 'berlangsung',
  },
  {
    id: 'sch-3',
    startTime: '13:00',
    endTime: '14:30',
    subject: 'Rekayasa Perangkat Lunak',
    className: '12 PPLG 2',
    room: 'Lab Komputer 2',
    status: 'akan_datang',
  },
]

export const activeTasks: GuruActiveTask[] = [
  {
    id: 'task-1',
    title: 'Praktik Dasar HTML',
    subject: 'Informatika',
    className: '11 PPLG 1',
    deadline: '28 Sep 2026',
    submitted: 24,
    totalStudents: 32,
    status: 'aktif',
  },
  {
    id: 'task-2',
    title: 'Quiz Harian Struktur Data',
    subject: 'Informatika',
    className: '11 PPLG 2',
    deadline: '25 Sep 2026',
    submitted: 21,
    totalStudents: 30,
    status: 'mendekati_deadline',
  },
  {
    id: 'task-3',
    title: 'Rancangan Basis Data Perpustakaan',
    subject: 'Rekayasa Perangkat Lunak',
    className: '12 PPLG 2',
    deadline: '19 Sep 2026',
    submitted: 19,
    totalStudents: 26,
    status: 'terlambat',
  },
]

export const pendingSubmissions: PendingSubmission[] = [
  {
    id: 'sub-1',
    studentName: 'Andi Pratama',
    studentInitial: 'AP',
    itemTitle: 'Praktik Dasar HTML',
    className: '11 PPLG 1',
    submittedAt: '2 jam lalu',
  },
  {
    id: 'sub-2',
    studentName: 'Nabila Putri',
    studentInitial: 'NP',
    itemTitle: 'Praktik Dasar HTML',
    className: '11 PPLG 1',
    submittedAt: '3 jam lalu',
  },
  {
    id: 'sub-3',
    studentName: 'Rizky Ramadhan',
    studentInitial: 'RR',
    itemTitle: 'Quiz Harian Struktur Data',
    className: '11 PPLG 2',
    submittedAt: '5 jam lalu',
  },
  {
    id: 'sub-4',
    studentName: 'Bagas Setiawan',
    studentInitial: 'BS',
    itemTitle: 'Rancangan Basis Data Perpustakaan',
    className: '12 PPLG 2',
    submittedAt: '1 hari lalu',
  },
]

export const activeAssessments: GuruActiveAssessment[] = [
  {
    id: 'assess-1',
    title: 'Ujian Tengah Semester — Informatika',
    subject: 'Informatika',
    className: '11 PPLG 1',
    period: '20–22 September 2026',
    totalParticipants: 32,
    completed: 14,
  },
  {
    id: 'assess-2',
    title: 'Kuis Algoritma Pemrograman',
    subject: 'Rekayasa Perangkat Lunak',
    className: '12 PPLG 2',
    period: '19 September 2026',
    totalParticipants: 26,
    completed: 9,
  },
]

export const studentActivities: StudentActivity[] = [
  {
    id: 'act-1',
    studentName: 'Andi Pratama',
    studentInitial: 'AP',
    action: 'mengumpulkan Praktik Dasar HTML',
    className: '11 PPLG 1',
    time: '2 jam lalu',
  },
  {
    id: 'act-2',
    studentName: 'Siti Rahmawati',
    studentInitial: 'SR',
    action: 'menyelesaikan Kuis Algoritma Pemrograman',
    className: '12 PPLG 2',
    time: '4 jam lalu',
  },
  {
    id: 'act-3',
    studentName: 'Budi Hartono',
    studentInitial: 'BH',
    action: 'mengirim Quiz Harian Struktur Data terlambat',
    className: '11 PPLG 2',
    time: '6 jam lalu',
  },
  {
    id: 'act-4',
    studentName: '5 siswa',
    studentInitial: '5',
    action: 'menyelesaikan materi Algoritma Dasar',
    className: '11 PPLG 1',
    time: '1 hari lalu',
  },
]

export const announcements: GuruAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Jadwal Rapat Koordinasi Kurikulum',
    summary: 'Rapat koordinasi kurikulum semester ganjil akan diadakan Jumat pekan ini.',
    date: '22 September 2026',
    isRead: false,
  },
  {
    id: 'ann-2',
    title: 'Pembaruan Sistem Penilaian',
    summary: 'Fitur input nilai essay kini mendukung rubrik penilaian bertingkat.',
    date: '20 September 2026',
    isRead: true,
  },
  {
    id: 'ann-3',
    title: 'Pemeliharaan Sistem',
    summary: 'Sistem akan mengalami pemeliharaan singkat pada Sabtu malam pukul 23:00 WIB.',
    date: '18 September 2026',
    isRead: true,
  },
]

// null kalau guru bukan Walas — komponen widget akan otomatis tersembunyi.
export const homeroomClass: HomeroomClass | null = {
  className: '11 PPLG 1',
  studentCount: 32,
}