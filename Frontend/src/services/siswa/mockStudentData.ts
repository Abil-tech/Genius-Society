// DATA SEMENTARA. Dipakai hanya oleh studentService.ts sampai backend siap.
// Hapus file ini saat fungsi service diganti dengan panggilan Axios ke /api/*.
import type { StudentDashboard, StudentProfile } from '../types/student'

const inHours = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString()
const agoMinutes = (m: number) => new Date(Date.now() - m * 60_000).toISOString()

export const mockProfile: StudentProfile = {
  id: 'stu-001',
  name: 'Abil Fida Ismail',
  className: 'XI TOI 1',
  nis: '9921',
}

export const mockUnreadCount = 3

export const mockDashboard: StudentDashboard = {
  academicYear: { label: '2026/2027', semester: 'Ganjil' },
  summary: {
    averageScore: 91.5,
    assignmentsCompleted: 24,
    assignmentsTotal: 28,
    upcomingAssessments: 3,
    nearestDeadline: {
      id: 'asg-101',
      title: 'Laporan Praktikum Motor Listrik',
      subjectName: 'Sistem Otomasi Industri',
      kind: 'assignment',
      dueAt: inHours(20),
    },
  },
  tasks: [
    { id: 'asg-101', title: 'Laporan Praktikum Motor Listrik', subjectName: 'Sistem Otomasi Industri', kind: 'assignment', dueAt: inHours(20), status: 'not_started' },
    { id: 'ass-201', title: 'Ujian PLC Dasar', subjectName: 'Sistem Otomasi Industri', kind: 'assessment', dueAt: inHours(72), status: 'not_started' },
    { id: 'prj-301', title: 'Projek Prototipe Sistem Pemanas', subjectName: 'Termodinamika Terapan', kind: 'project', dueAt: inHours(24 * 6), status: 'not_started' },
    { id: 'ass-202', title: 'Kuis Sifat Mekanik Logam', subjectName: 'Dasar Ilmu Material', kind: 'assessment', dueAt: inHours(24 * 8), status: 'not_started' },
    { id: 'asg-102', title: 'Latihan Siklus Rankine', subjectName: 'Termodinamika Terapan', kind: 'assignment', dueAt: inHours(-30), status: 'submitted' },
  ],
  subjects: [
    { id: 'sub-1', code: 'ENG_301', name: 'Sistem Otomasi Industri', teacherName: 'Dr. H. Vance', finalScore: 91.5 },
    { id: 'sub-2', code: 'MTH_204', name: 'Termodinamika Terapan', teacherName: 'Prof. A. Lin', finalScore: 87.2 },
    { id: 'sub-3', code: 'MAT_101', name: 'Dasar Ilmu Material', teacherName: 'Dr. R. Sterling', finalScore: 96.0 },
  ],
  activities: [
    { id: 'act-1', type: 'submission', message: 'Tugas "Latihan Siklus Rankine" berhasil dikumpulkan.', occurredAt: agoMinutes(50) },
    { id: 'act-2', type: 'grade', message: 'Nilai "Kuis Teori 4" keluar: 88.5.', occurredAt: agoMinutes(60 * 6) },
    { id: 'act-3', type: 'notification', message: 'Materi baru di Dasar Ilmu Material: Diagram Tegangan-Regangan.', occurredAt: agoMinutes(60 * 27) },
    { id: 'act-4', type: 'grade', message: 'Nilai "UTS Praktik" diperbarui menjadi 92.0.', occurredAt: agoMinutes(60 * 24 * 3) },
  ],
}
