export interface GuruSummary {
  totalClasses: number
  totalSubjects: number
  activeTasks: number
  pendingGrading: number
}

export type ScheduleStatus = 'akan_datang' | 'berlangsung' | 'selesai'

export interface TodaySchedule {
  id: string
  startTime: string
  endTime: string
  subject: string
  className: string
  room: string
  status: ScheduleStatus
}

export type GuruTaskStatus = 'aktif' | 'mendekati_deadline' | 'terlambat' | 'selesai'

export interface GuruActiveTask {
  id: string
  title: string
  subject: string
  className: string
  deadline: string
  submitted: number
  totalStudents: number
  status: GuruTaskStatus
}

export interface PendingSubmission {
  id: string
  studentName: string
  studentInitial: string
  itemTitle: string
  className: string
  submittedAt: string
}

export interface GuruActiveAssessment {
  id: string
  title: string
  subject: string
  className: string
  period: string
  totalParticipants: number
  completed: number
}

export interface StudentActivity {
  id: string
  studentName: string
  studentInitial: string
  action: string
  className: string
  time: string
}

export interface GuruAnnouncement {
  id: string
  title: string
  summary: string
  date: string
  isRead: boolean
}

export interface HomeroomClass {
  className: string
  studentCount: number
}