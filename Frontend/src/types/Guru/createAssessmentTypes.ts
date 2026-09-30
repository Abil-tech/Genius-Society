// Tipe-tipe ini mencerminkan secara tepat kontrak API backend Go.
// Jangan ubah nama field JSON — harus identik dengan dto/assessment_dto.go

// ─── Backend DTO shapes (request) ────────────────────────────────────────────

/** POST /api/guru/assessments */
export interface CreateAssessmentRequest {
  title: string                 // min 3, max 255
  description: string           // max 2000
  subjectId: string             // MongoDB ObjectID string
  classId: string               // MongoDB ObjectID string
  academicYearId: string        // MongoDB ObjectID string
  startDate: string             // ISO 8601 datetime
  endDate: string               // ISO 8601 datetime
  durationMinutes: number       // 5–480
  category: 'harian' | 'uts' | 'uas'  // maps to assessment Category field
  showResultsImmediately: boolean
}

/** POST /api/guru/assessments/:id/questions */
export interface AddQuestionRequest {
  questionText: string          // min 10
  questionType: 'multiple_choice' | 'essay'
  weight: number                // 0 < weight <= 100
  order: number                 // min 1
  options?: { text: string }[]  // pilihan ganda only
  correctOptionIndex?: number   // 0-based index, pilihan ganda only
}

// ─── Backend DTO shapes (response) ───────────────────────────────────────────

export interface AssessmentResponseDTO {
  id: string
  title: string
  description: string
  teacherId: string
  subjectId: string
  classId: string
  academicYearId: string
  startDate: string
  endDate: string
  durationMinutes: number
  questionCount: number
  totalWeight: number
  category: string
  maxAttempts: number
  showResultsImmediately: boolean
  createdAt: string
  updatedAt: string
}

export interface AssessmentOptionDTO {
  text: string
}

export interface AssessmentQuestionResponseDTO {
  id: string
  assessmentId: string
  questionText: string
  questionType: 'multiple_choice' | 'essay'
  options?: AssessmentOptionDTO[]
  correctOptionIndex: number
  weight: number
  order: number
}

// ─── Lookup types returned by /api/admin/classes & /api/admin/subjects ───────

export interface ClassOption {
  id: string
  name: string
  gradeLevel: string
  academicYearId: string
}

export interface SubjectOption {
  id: string
  name: string
  code: string
}

export interface AcademicYearOption {
  id: string
  name: string
  isCurrent: boolean
}

// ─── Local UI form state (does NOT map directly to API) ──────────────────────

/** One option row in the create-question modal UI */
export interface QuestionOptionUI {
  id: string    // temp client-side id (uuid / timestamp)
  text: string
}

/** Local question being composed in QuestionModal before submitting */
export interface AssessmentQuestion {
  id: string                             // temp client-side id
  questionNumber: number
  question: string
  type: 'multiple_choice' | 'essay'
  options?: QuestionOptionUI[]
  correctAnswer?: string                 // id of the correct QuestionOptionUI
  duration?: number                      // bobot (weight) reused via this field
}

/** Full local form state for CreateAssessmentPage */
export interface CreateAssessmentForm {
  // Informasi Dasar
  judul: string
  deskripsi: string
  subjectId: string
  classId: string
  academicYearId: string

  // Konfigurasi
  tipeAsesmen: 'harian' | 'uts' | 'uas'
  durasi: number                         // durationMinutes
  showResultsImmediately: boolean

  // Jadwal
  jadwalMulai: string                    // date part (YYYY-MM-DD)
  jadwalMulaiTime: string                // time part (HH:mm)
  jadwalSelesai: string
  jadwalSelesaiTime: string

  // Questions (local only — persisted via separate POST per question)
  pertanyaan: AssessmentQuestion[]
}

// ─── Dropdown option helpers ──────────────────────────────────────────────────

export const TIPE_ASESMEN_OPTIONS: { value: CreateAssessmentForm['tipeAsesmen']; label: string }[] = [
  { value: 'harian', label: 'Penilaian Harian' },
  { value: 'uts',    label: 'Ujian Tengah Semester (UTS)' },
  { value: 'uas',    label: 'Ujian Akhir Semester (UAS)' },
]

export const VISIBILITAS_OPTIONS = [
  { value: true,  label: 'Tampilkan langsung setelah submit' },
  { value: false, label: 'Tampilkan oleh guru (manual)' },
]