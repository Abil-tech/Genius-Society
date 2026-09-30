import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import GuruLayout from '../../layouts/GuruLayout'
import BasicInfoSection from '../../components/Guru/assessment/BasicInfoSection'
import QuestionsListSection from '../../components/Guru/assessment/QuestionListSection'
import ConfigurationPanel from '../../components/Guru/assessment/ConfigurationPanel'
import AdvancedSettingsSection from '../../components/Guru/assessment/AdvancedSettingsSection'
import QuestionModal from '../../components/Guru/assessment/QuestionModal'
import {
  createAssessment,
  addQuestion,
  getClasses,
  getSubjects,
  toAddQuestionRequest,
} from '../../services/guruService'
import type {
  CreateAssessmentForm,
  AssessmentQuestion,
  ClassOption,
  SubjectOption,
} from '../../types/Guru/createAssessmentTypes'

/** Combine date + time strings into an ISO 8601 datetime string */
function toISO(date: string, time: string): string {
  return new Date(`${date}T${time || '00:00'}:00`).toISOString()
}

export default function CreateAssessmentPage() {
  const navigate = useNavigate()

  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentEditQuestion, setCurrentEditQuestion] = useState<AssessmentQuestion | null>(null)

  // Lookup data
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [subjects, setSubjects] = useState<SubjectOption[]>([])
  const [lookupError, setLookupError] = useState<string | null>(null)

  const [formData, setFormData] = useState<CreateAssessmentForm>({
    judul: '',
    deskripsi: '',
    subjectId: '',
    classId: '',
    academicYearId: '',

    tipeAsesmen: 'harian',
    durasi: 90,
    showResultsImmediately: false,

    jadwalMulai: '',
    jadwalMulaiTime: '',
    jadwalSelesai: '',
    jadwalSelesaiTime: '',

    pertanyaan: [],
  })

  // Load classes & subjects on mount
  useEffect(() => {
    Promise.all([getClasses(), getSubjects()])
      .then(([cls, subj]) => {
        setClasses(cls)
        setSubjects(subj)
        // Pre-select academic year from first class if available
        if (cls.length > 0 && !formData.academicYearId) {
          setFormData(prev => ({ ...prev, academicYearId: cls[0].academicYearId }))
        }
      })
      .catch(() => setLookupError('Gagal memuat data kelas dan mata pelajaran.'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // When classId changes, sync academicYearId automatically
  const handleClassChange = (classId: string) => {
    const found = classes.find(c => c.id === classId)
    setFormData(prev => ({
      ...prev,
      classId,
      academicYearId: found?.academicYearId ?? prev.academicYearId,
    }))
  }

  // ── Question modal ─────────────────────────────────────────────────────────

  const handleAddQuestionClick = useCallback(() => {
    setCurrentEditQuestion(null)
    setIsModalOpen(true)
  }, [])

  const handleEditQuestionClick = useCallback((id: string) => {
    const q = formData.pertanyaan.find(x => x.id === id)
    if (q) {
      setCurrentEditQuestion(q)
      setIsModalOpen(true)
    }
  }, [formData.pertanyaan])

  const handleSaveQuestion = useCallback((savedQ: AssessmentQuestion) => {
    setFormData(prev => {
      const isEdit = prev.pertanyaan.some(q => q.id === savedQ.id)
      const newPertanyaan = isEdit
        ? prev.pertanyaan.map(q => q.id === savedQ.id ? savedQ : q)
        : [...prev.pertanyaan, { ...savedQ, questionNumber: prev.pertanyaan.length + 1 }]
      return { ...prev, pertanyaan: newPertanyaan }
    })
    setIsModalOpen(false)
  }, [])

  const handleDeleteQuestion = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      pertanyaan: prev.pertanyaan
        .filter(q => q.id !== id)
        .map((q, i) => ({ ...q, questionNumber: i + 1 })),
    }))
  }, [])

  // ── Validation ─────────────────────────────────────────────────────────────

  function validate(requireQuestions: boolean): string | null {
    if (!formData.judul.trim()) return 'Judul asesmen tidak boleh kosong.'
    if (!formData.subjectId) return 'Pilih mata pelajaran terlebih dahulu.'
    if (!formData.classId) return 'Pilih kelas terlebih dahulu.'
    if (!formData.jadwalMulai || !formData.jadwalSelesai) return 'Jadwal mulai dan selesai harus diisi.'
    if (requireQuestions && formData.pertanyaan.length === 0) return 'Tambahkan minimal 1 pertanyaan.'
    return null
  }

  // ── Submit helpers ─────────────────────────────────────────────────────────

  async function submitToAPI(requirePublish: boolean) {
    const err = validate(requirePublish)
    if (err) { alert(err); return }

    const setter = requirePublish ? setIsPublishing : setIsSaving
    setter(true)

    try {
      // 1️⃣  Create assessment shell
      const assessment = await createAssessment({
        title: formData.judul,
        description: formData.deskripsi,
        subjectId: formData.subjectId,
        classId: formData.classId,
        academicYearId: formData.academicYearId,
        startDate: toISO(formData.jadwalMulai, formData.jadwalMulaiTime),
        endDate: toISO(formData.jadwalSelesai, formData.jadwalSelesaiTime),
        durationMinutes: formData.durasi,
        category: formData.tipeAsesmen,
        showResultsImmediately: formData.showResultsImmediately,
      })

      // 2️⃣  Add each question sequentially
      for (let i = 0; i < formData.pertanyaan.length; i++) {
        await addQuestion(assessment.id, toAddQuestionRequest(formData.pertanyaan[i], i))
      }

      alert(requirePublish ? 'Asesmen berhasil diterbitkan!' : 'Asesmen berhasil disimpan sebagai draft.')
      navigate('/guru/assessment')
    } catch (error: any) {
      const msg = error?.message ?? 'Terjadi kesalahan. Silakan coba lagi.'
      alert(`Gagal menyimpan asesmen: ${msg}`)
      console.error(error)
    } finally {
      setter(false)
    }
  }

  const handleSaveDraft    = () => submitToAPI(false)
  const handlePublish      = () => submitToAPI(true)

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <GuruLayout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <button
              onClick={() => navigate('/guru/assessment')}
              className="flex items-center gap-1 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Assessment
            </button>
            <span>›</span>
            <span className="text-gray-900 font-medium">Buat Asesmen Baru</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Buat Asesmen Baru</h1>
        </div>
        <button
          onClick={() => navigate('/guru/assessment')}
          className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
        >
          Batal
        </button>
      </div>

      {lookupError && (
        <div className="mb-4 rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
          ⚠️ {lookupError} Dropdown kelas & mapel akan kosong.
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <BasicInfoSection
            judul={formData.judul}
            mataPelajaran={formData.subjectId}
            tingkatKelas={formData.classId}
            onJudulChange={(v) => setFormData(prev => ({ ...prev, judul: v }))}
            onMataPelajaranChange={(v) => setFormData(prev => ({ ...prev, subjectId: v }))}
            onTingkatKelasChange={handleClassChange}
            // Pass real options so BasicInfoSection can render real dropdowns
            subjectOptions={subjects.map(s => ({ value: s.id, label: s.name }))}
            classOptions={classes.map(c => ({ value: c.id, label: c.name }))}
          />

          <QuestionsListSection
            questions={formData.pertanyaan}
            onAddQuestion={handleAddQuestionClick}
            onEditQuestion={handleEditQuestionClick}
            onDeleteQuestion={handleDeleteQuestion}
          />

          <AdvancedSettingsSection
            jadwalMulai={formData.jadwalMulai}
            jadwalMulaiTime={formData.jadwalMulaiTime}
            jadwalSelesai={formData.jadwalSelesai}
            jadwalSelesaiTime={formData.jadwalSelesaiTime}
            acakPertanyaan={false}
            visibilitasNilai={formData.showResultsImmediately ? 'immediate' : 'after_submission'}
            onJadwalMulaiChange={(date, time) =>
              setFormData(prev => ({ ...prev, jadwalMulai: date, jadwalMulaiTime: time }))
            }
            onJadwalSelesaiChange={(date, time) =>
              setFormData(prev => ({ ...prev, jadwalSelesai: date, jadwalSelesaiTime: time }))
            }
            onAcakPertanyaanChange={() => {/* not stored currently */}}
            onVisibilitasNilaiChange={(v) =>
              setFormData(prev => ({ ...prev, showResultsImmediately: v === 'immediate' }))
            }
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving || isPublishing}
              className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : '📄 Simpan Draft'}
            </button>
            <button
              onClick={handlePublish}
              disabled={isSaving || isPublishing}
              className="flex-1 px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isPublishing ? <><Loader2 className="w-4 h-4 animate-spin" /> Menerbitkan...</> : '✓ Terbitkan Asesmen'}
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <ConfigurationPanel
            tipeAsesmen={formData.tipeAsesmen}
            durasi={formData.durasi}
            passingGrade={75}
            onTipeAsesmenChange={(v) => setFormData(prev => ({ ...prev, tipeAsesmen: v as CreateAssessmentForm['tipeAsesmen'] }))}
            onDurasiChange={(v) => setFormData(prev => ({ ...prev, durasi: v }))}
            onPassingGradeChange={() => {/* not in backend yet */}}
          />
        </div>
      </div>

      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuestion}
        initialData={currentEditQuestion}
      />
    </GuruLayout>
  )
}