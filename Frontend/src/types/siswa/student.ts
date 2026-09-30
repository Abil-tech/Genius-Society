export interface StudentProfile {
  id: string
  name: string
  className: string
  nis: string
}

export type TaskKind = 'assignment' | 'project' | 'assessment'
export type TaskStatus = 'not_started' | 'submitted' | 'graded' | 'overdue'

export interface DashboardTaskItem {
  id: string
  title: string
  subjectName: string
  kind: TaskKind
  dueAt: string // ISO 8601
  status: TaskStatus
}

export interface NearestDeadline {
  id: string
  title: string
  subjectName: string
  kind: Exclude<TaskKind, 'assessment'>
  dueAt: string
}

export interface SubjectGrade {
  id: string
  code: string
  name: string
  teacherName: string
  finalScore: number // 0-100, hasil rumus bobot dari grading_configs
}

export type ActivityType = 'submission' | 'grade' | 'notification'

export interface ActivityItem {
  id: string
  type: ActivityType
  message: string
  occurredAt: string // ISO 8601
}

export interface StudentDashboard {
  academicYear: { label: string; semester: string }
  summary: {
    averageScore: number | null
    assignmentsCompleted: number
    assignmentsTotal: number
    upcomingAssessments: number
    nearestDeadline: NearestDeadline | null
  }
  tasks: DashboardTaskItem[]
  subjects: SubjectGrade[]
  activities: ActivityItem[]
}
