export interface GuruAssignmentItem {
  id: string
  refId: string            // contoh: "TG-402"
  name: string
  className: string        // contoh: "XII PPLG I"
  dueDate: string          // ISO date
  submittedCount: number
  totalStudents: number
}

export interface GuruUpcomingDeadline {
  id: string
  dueAt: string            // ISO datetime
  title: string
  className: string
}

export interface GuruClassOption {
  id: string
  name: string
}

export interface GuruAssignmentsResponse {
  summary: {
    ungradedCount: number
    efficiencyRate: number // 0-100
  }
  assignments: GuruAssignmentItem[]
  upcomingDeadlines: GuruUpcomingDeadline[]
  classes: GuruClassOption[]
}