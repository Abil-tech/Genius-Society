export type AssessmentStatus = 'active' | 'scheduled' | 'completed'

export interface GuruAssessmentItem {
  id: string
  code: string               // contoh: "MODULE_A24", "ARCHIVE_992"
  title: string
  description: string
  status: AssessmentStatus
  durationMinutes: number
  totalStudents: number
  // active
  participantCount?: number
  avgTimeSeconds?: number
  processedPercent?: number  // 0-100
  // scheduled
  startDate?: string         // ISO datetime
  isReady?: boolean
  // completed
  finishedAt?: string        // ISO datetime
  averageScore?: number      // 0-100
  topStudents?: string[]     // inisial, contoh: ["JS", "RT"]
}

export interface GuruAssessmentsResponse {
  performance: {
    averageScore: number
    averageScoreDelta: number   // +2.4
    completionRate: number      // 0-100
    monitoringCount: number
  }
  statusSummary: {
    totalAssessments: number
    pendingReviews: number
    successRate: number
  }
  assessments: GuruAssessmentItem[]
}