import { useState, useEffect, useCallback } from 'react'
import { X, Plus, Trash2, CheckCircle2, AlertCircle, GripVertical, BookOpen, List } from 'lucide-react'
import type { AssessmentQuestion } from '../../../types/Guru/createAssessmentTypes'

interface QuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (question: AssessmentQuestion) => void
  initialData: AssessmentQuestion | null
}

interface ValidationErrors {
  question?: string
  options?: string
  correctAnswer?: string
  bobot?: string
}

const makeOptions = () => {
  const ts = Date.now()
  return [
    { id: `opt-${ts}-1`, text: '' },
    { id: `opt-${ts}-2`, text: '' },
  ]
}

const makeDefault = (): AssessmentQuestion => {
  const opts = makeOptions()
  return {
    id: `q-${Date.now()}`,
    questionNumber: 0,
    question: '',
    type: 'multiple_choice',
    options: opts,
    correctAnswer: opts[0].id,
    duration: 0,
  }
}

export default function QuestionModal({ isOpen, onClose, onSave, initialData }: QuestionModalProps) {
  const [formData, setFormData] = useState<AssessmentQuestion>(makeDefault)
  const [bobot, setBobot] = useState(10)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState(false)

  // Reset form whenever modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const opts = initialData.options?.length ? [...initialData.options] : makeOptions()
        setFormData({
          ...initialData,
          options: opts,
          correctAnswer: initialData.correctAnswer || opts[0]?.id || '',
        })
        setBobot(initialData.duration ?? 10)
      } else {
        const fresh = makeDefault()
        setFormData(fresh)
        setBobot(10)
      }
      setErrors({})
      setTouched(false)
    }
  }, [isOpen, initialData])

  const validate = useCallback((data: AssessmentQuestion, bobotVal: number): ValidationErrors => {
    const errs: ValidationErrors = {}
    if (!data.question.trim()) errs.question = 'Pertanyaan tidak boleh kosong.'
    if (bobotVal < 1 || bobotVal > 100) errs.bobot = 'Bobot harus antara 1–100.'

    if (data.type === 'multiple_choice') {
      const filled = (data.options || []).filter(o => o.text.trim() !== '')
      if (filled.length < 2) errs.options = 'Minimal 2 opsi jawaban harus diisi.'
      if (!data.correctAnswer || !(data.options || []).find(o => o.id === data.correctAnswer)) {
        errs.correctAnswer = 'Pilih satu jawaban yang benar.'
      }
    }
    return errs
  }, [])

  const handleSave = () => {
    setTouched(true)
    const errs = validate(formData, bobot)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    // Filter out blank options before saving
    const cleanedOptions = formData.type === 'multiple_choice'
      ? (formData.options || []).filter(o => o.text.trim() !== '')
      : undefined

    onSave({ ...formData, options: cleanedOptions, duration: bobot })
  }

  const handleAddOption = () => {
    const newId = `opt-${Date.now()}`
    setFormData(prev => ({
      ...prev,
      options: [...(prev.options || []), { id: newId, text: '' }],
    }))
  }

  const handleRemoveOption = (idToRemove: string) => {
    setFormData(prev => {
      const newOpts = (prev.options || []).filter(o => o.id !== idToRemove)
      const newCorrect = prev.correctAnswer === idToRemove
        ? (newOpts[0]?.id ?? '')
        : prev.correctAnswer
      return { ...prev, options: newOpts, correctAnswer: newCorrect }
    })
  }

  const handleOptionChange = (id: string, text: string) => {
    setFormData(prev => ({
      ...prev,
      options: (prev.options || []).map(o => o.id === id ? { ...o, text } : o),
    }))
  }

  const handleTypeChange = (type: 'multiple_choice' | 'essay') => {
    setFormData(prev => {
      if (type === 'multiple_choice') {
        const opts = makeOptions()
        return { ...prev, type, options: opts, correctAnswer: opts[0].id }
      }
      return { ...prev, type, options: undefined, correctAnswer: undefined }
    })
  }

  const handleFieldChange = <K extends keyof AssessmentQuestion>(key: K, val: AssessmentQuestion[K]) => {
    setFormData(prev => {
      const next = { ...prev, [key]: val }
      if (touched) setErrors(validate(next, bobot))
      return next
    })
  }

  if (!isOpen) return null

  const options = formData.options || []
  const optionCount = options.length

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {initialData ? 'Edit Pertanyaan' : 'Tambah Pertanyaan'}
              </h2>
              <p className="text-xs text-gray-400">
                {initialData ? 'Ubah soal yang sudah ada' : 'Buat soal baru untuk assessment ini'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* Tipe + Bobot row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Tipe Soal</label>
              <div className="grid grid-cols-2 gap-2">
                {(['multiple_choice', 'essay'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTypeChange(t)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      formData.type === t
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {t === 'multiple_choice'
                      ? <><List className="w-4 h-4" /> Pilihan Ganda</>
                      : <><BookOpen className="w-4 h-4" /> Essay</>
                    }
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Bobot Nilai <span className="font-normal text-gray-400">(poin)</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBobot(b => Math.max(1, b - 5))}
                  className="w-9 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  value={bobot}
                  onChange={e => {
                    const v = Number(e.target.value)
                    setBobot(v)
                    if (touched) setErrors(validate(formData, v))
                  }}
                  min={1}
                  max={100}
                  className={`flex-1 text-center px-3 py-2.5 rounded-lg border ${
                    errors.bobot ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-gray-800`}
                />
                <button
                  type="button"
                  onClick={() => setBobot(b => Math.min(100, b + 5))}
                  className="w-9 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold transition-colors"
                >
                  +
                </button>
              </div>
              {errors.bobot && <p className="text-xs text-red-500">{errors.bobot}</p>}
            </div>
          </div>

          {/* Teks Pertanyaan */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Pertanyaan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.question}
              onChange={e => handleFieldChange('question', e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Tulis pertanyaan di sini..."
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors ${
                errors.question ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.question ? (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.question}
              </p>
            ) : (
              <p className="text-xs text-gray-400">{formData.question.length} karakter</p>
            )}
          </div>

          {/* Pilihan Ganda */}
          {formData.type === 'multiple_choice' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Opsi Jawaban</label>
                  <p className="text-xs text-gray-400 mt-0.5">Klik radio untuk menandai jawaban benar</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  optionCount < 2 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-700'
                }`}>
                  {optionCount} opsi
                </span>
              </div>

              {errors.options && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.options}
                </p>
              )}
              {errors.correctAnswer && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.correctAnswer}
                </p>
              )}

              <div className="space-y-2.5">
                {options.map((option, index) => {
                  const isCorrect = formData.correctAnswer === option.id
                  return (
                    <div
                      key={option.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        isCorrect
                          ? 'border-green-400 bg-green-50'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      {/* Drag handle (visual only) */}
                      <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0 cursor-grab" />

                      {/* Letter badge */}
                      <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold ${
                        isCorrect ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>

                      {/* Text input */}
                      <input
                        type="text"
                        value={option.text}
                        onChange={e => handleOptionChange(option.id, e.target.value)}
                        placeholder={`Opsi ${String.fromCharCode(65 + index)}`}
                        className={`flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400 ${
                          isCorrect ? 'font-medium' : ''
                        }`}
                      />

                      {/* Correct toggle */}
                      <button
                        type="button"
                        onClick={() => handleFieldChange('correctAnswer', option.id)}
                        title={isCorrect ? 'Jawaban benar' : 'Tandai sebagai benar'}
                        className="flex-shrink-0"
                      >
                        <CheckCircle2 className={`w-5 h-5 transition-colors ${
                          isCorrect ? 'text-green-500' : 'text-gray-300 hover:text-green-400'
                        }`} />
                      </button>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(option.id)}
                        disabled={optionCount <= 2}
                        className="flex-shrink-0 p-1 text-gray-300 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Hapus opsi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={handleAddOption}
                disabled={optionCount >= 6}
                className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 px-3 py-2 rounded-lg hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Opsi {optionCount >= 6 && '(maks. 6)'}
              </button>
            </div>
          )}

          {/* Essay hint */}
          {formData.type === 'essay' && (
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-700 flex gap-3">
              <BookOpen className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" />
              <div>
                <p className="font-semibold mb-1">Soal Essay</p>
                <p className="text-blue-600 text-xs leading-relaxed">
                  Jawaban essay akan dinilai secara manual oleh guru. Anda dapat menambahkan rubrik penilaian atau petunjuk jawaban pada deskripsi soal.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/60 rounded-b-2xl">
          <p className="text-xs text-gray-400">
            {formData.type === 'multiple_choice'
              ? `${optionCount} opsi · bobot ${bobot} poin`
              : `Essay · bobot ${bobot} poin`
            }
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 text-sm bg-orange-500 text-white font-semibold hover:bg-orange-600 rounded-lg transition-colors shadow-sm flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simpan Pertanyaan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
