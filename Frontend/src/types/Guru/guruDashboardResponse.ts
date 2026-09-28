import type {
  GuruSummary,
  TodaySchedule,
  GuruActiveTask,
  PendingSubmission,
  GuruActiveAssessment,
  StudentActivity,
  GuruAnnouncement,
  HomeroomClass,
} from './guruDashboard'

export interface GuruDashboardResponse {
  summary: GuruSummary
  todaySchedules: TodaySchedule[]
  activeTasks: GuruActiveTask[]
  pendingSubmissions: PendingSubmission[]
  activeAssessments: GuruActiveAssessment[]
  studentActivities: StudentActivity[]
  announcements: GuruAnnouncement[]
  homeroomClass: HomeroomClass | null
}
