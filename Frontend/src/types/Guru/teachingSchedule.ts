export type ClassSessionStatus = 'selesai' | 'berlangsung' | 'mendatang'

export interface ClassSession {
  id: string
  startTime: string
  endTime: string
  subject: string
  className: string
  room: string
  status: ClassSessionStatus
}

export interface ScheduleDay {
  day: string
  date: string
  sessions: ClassSession[]
}

export interface WeekSummary {
  totalHours: number
  kpiProgress: number
  nextClass: {
    subject: string
    time: string
  } | null
}