import api from './api'
import type { GuruDashboardResponse } from '../types/Guru/guruDashboardResponse'
import type { GuruAssignmentsResponse } from '../types/Guru/guruAssignmentResponse'
import type { GuruAssessmentsResponse } from '../types/Guru/guruAssessmentsResponse'
import type {
  CreateAssessmentRequest,
  AddQuestionRequest,
  AssessmentResponseDTO,
  AssessmentQuestionResponseDTO,
  ClassOption,
  SubjectOption,
  AssessmentQuestion,
} from '../types/Guru/createAssessmentTypes'

interface ApiSuccess<T> {
  success: true
  data: T
}

// ─── Dashboard / Assignment ───────────────────────────────────────────────────

export async function getGuruDashboard(): Promise<GuruDashboardResponse> {
  const { data } = await api.get<ApiSuccess<GuruDashboardResponse>>('/api/guru/dashboard')
  return data.data
}

export async function getGuruAssignments(classId?: string): Promise<GuruAssignmentsResponse> {
  const { data } = await api.get<ApiSuccess<GuruAssignmentsResponse>>('/api/guru/assignments', {
    params: classId ? { classId } : undefined,
  })
  return data.data
}

// ─── Assessments list (overview page) ────────────────────────────────────────

export async function getGuruAssessments(): Promise<GuruAssessmentsResponse> {
  const { data } = await api.get('/api/guru/assessments', {
    params: { view: 'teacher-overview' },
  })

  const items: AssessmentResponseDTO[] = Array.isArray(data?.data) ? data.data : []

  return {
    performance: {
      averageScore: 78.5,
      averageScoreDelta: 2.4,
      completionRate: 92,
      monitoringCount: 3,
    },
    statusSummary: {
      totalAssessments: data?.total || items.length,
      pendingReviews: 0,
      successRate: 85,
    },
    assessments: items.map((item) => ({
      id: item.id,
      code: `ASM_${item.id.substring(0, 4).toUpperCase()}`,
      title: item.title,
      description: item.description,
      status: 'active' as const,
      durationMinutes: item.durationMinutes,
      totalStudents: item.questionCount,
      startDate: item.startDate,
      participantCount: 0,
    })),
  }
}

// ─── Create Assessment (POST then add questions) ──────────────────────────────

/** Step 1: Create the assessment shell, returns the new assessment's id */
export async function createAssessment(req: CreateAssessmentRequest): Promise<AssessmentResponseDTO> {
  const { data } = await api.post<ApiSuccess<AssessmentResponseDTO>>('/api/guru/assessments', req)
  return data.data
}

/** Step 2: Add a single question to an existing assessment */
export async function addQuestion(
  assessmentId: string,
  req: AddQuestionRequest,
): Promise<AssessmentQuestionResponseDTO> {
  const { data } = await api.post<ApiSuccess<AssessmentQuestionResponseDTO>>(
    `/api/guru/assessments/${assessmentId}/questions`,
    req,
  )
  return data.data
}

/** Update an existing question */
export async function updateQuestion(
  assessmentId: string,
  questionId: string,
  req: Omit<AddQuestionRequest, 'order'> & { order: number },
): Promise<void> {
  await api.put(`/api/guru/assessments/${assessmentId}/questions/${questionId}`, req)
}

/** Delete a question */
export async function deleteQuestion(assessmentId: string, questionId: string): Promise<void> {
  await api.delete(`/api/guru/assessments/${assessmentId}/questions/${questionId}`)
}

/** Get full assessment detail including questions */
export async function getAssessmentDetail(
  assessmentId: string,
): Promise<{ assessment: AssessmentResponseDTO; questions: AssessmentQuestionResponseDTO[] }> {
  const { data } = await api.get(`/api/guru/assessments/${assessmentId}`)
  return data.data
}

/**
 * Convert local UI AssessmentQuestion → AddQuestionRequest for the backend.
 * Also calculates the `order` from position index.
 */
export function toAddQuestionRequest(q: AssessmentQuestion, index: number): AddQuestionRequest {
  const req: AddQuestionRequest = {
    questionText: q.question,
    questionType: q.type,
    weight: q.duration ?? 10,  // `duration` field stores bobot in UI
    order: index + 1,
  }

  if (q.type === 'multiple_choice' && q.options?.length) {
    req.options = q.options.map(o => ({ text: o.text }))
    const correctIdx = q.options.findIndex(o => o.id === q.correctAnswer)
    req.correctOptionIndex = correctIdx >= 0 ? correctIdx : 0
  }

  return req
}

// ─── Lookup data (classes & subjects for dropdowns) ──────────────────────────

export async function getClasses(): Promise<ClassOption[]> {
  const { data } = await api.get<ApiSuccess<{ classes: ClassOption[] }>>('/api/guru/classes')
  return data.data.classes ?? []
}

export async function getSubjects(): Promise<SubjectOption[]> {
  const { data } = await api.get<ApiSuccess<{ subjects: SubjectOption[] }>>('/api/guru/subjects')
  return data.data.subjects ?? []
}

// ─── Download helpers ─────────────────────────────────────────────────────────

async function downloadBlob(url: string, filename: string) {
  const res = await api.get(url, { responseType: 'blob' })
  const href = URL.createObjectURL(res.data)
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  a.click()
  URL.revokeObjectURL(href)
}

export const downloadAssessmentReport = () =>
  downloadBlob('/api/assessments/report', 'laporan-assessment.pdf')

export const downloadAssessmentRanking = (id: string) =>
  downloadBlob(`/api/assessments/${id}/ranking`, `peringkat-${id}.pdf`)