export type TaskStatus = 'draft' | 'aktif' | 'selesai' | 'terlambat' | 'diarsipkan'

export interface TaskAttachment {
  name: string
  type: string
  size: string
}

export interface Task {
  id: string
  title: string
  shortDescription: string
  description: string
  teacher: string
  teacherEmail: string
  subject: string
  subjectCode: string
  classNames: string[]
  academicYear: string
  createdDate: string // ISO
  startDate: string // ISO
  deadline: string // ISO
  status: TaskStatus
  submissionTotal: number
  submissionSubmitted: number
  submissionLate: number
  attachments: TaskAttachment[]
}

export interface TaskEditValues {
  title: string
  description: string
  teacher: string
  subject: string
  classNames: string[]
  startDate: string
  deadline: string
  status: TaskStatus
}