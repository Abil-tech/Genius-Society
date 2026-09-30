// Frontend/src/components/Guru/assessment/QuestionsListSection.tsx

import { Edit2, Plus, Trash2 } from 'lucide-react'
import type { AssessmentQuestion } from '../../../types/Guru/createAssessmentTypes'

interface QuestionsListSectionProps {
  questions: AssessmentQuestion[]
  onAddQuestion: () => void
  onEditQuestion: (id: string) => void
  onDeleteQuestion: (id: string) => void
}

export const QuestionsListSection = ({
  questions,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}: QuestionsListSectionProps) => {
  const getQuestionTypeLabel = (type: string) => {
    if (type === 'multiple_choice') return 'Pilihan Ganda'
    if (type === 'essay') return 'Essay'
    return type
  }

  return (
    <div className="rounded-2xl border border-brand-navy/10 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-start gap-2">
          <span className="text-2xl">📋</span>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Daftar Pertanyaan</h2>
            <p className="text-sm text-gray-500 mt-1">
              {questions.length} soal{questions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        {questions.length > 0 && (
          <div className="bg-orange-100 px-3 py-1 rounded-full text-xs font-semibold text-orange-700">
            {questions.length} Soal
          </div>
        )}
      </div>

      <div className="space-y-3 mb-4">
        {questions.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-500 text-sm">
              Belum ada pertanyaan. Tambahkan pertanyaan pertama Anda!
            </p>
          </div>
        ) : (
          questions.map((question) => (
            <div
              key={question.id}
              className="rounded-xl border border-orange-200 bg-orange-50 p-4 transition-all hover:border-orange-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-orange-600">
                      {question.questionNumber}.
                    </span>
                    <span className="inline-block px-2 py-1 bg-white rounded text-xs font-semibold text-orange-600 border border-orange-200">
                      {getQuestionTypeLabel(question.type)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 break-words">
                    {question.question}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onEditQuestion(question.id)}
                    className="p-2 hover:bg-white rounded-lg transition-colors group"
                    title="Edit soal"
                  >
                    <Edit2 className="w-4 h-4 text-orange-600 group-hover:text-orange-700" />
                  </button>
                  <button
                    onClick={() => onDeleteQuestion(question.id)}
                    className="p-2 hover:bg-white rounded-lg transition-colors group"
                    title="Hapus soal"
                  >
                    <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-700" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tombol Tambah Pertanyaan */}
      <button
        onClick={onAddQuestion}
        className="w-full rounded-xl border-2 border-dashed border-orange-300 bg-orange-50/50 py-8 text-center transition-colors hover:border-orange-400 hover:bg-orange-50 active:bg-orange-100"
      >
        <div className="flex flex-col items-center gap-2">
          <Plus className="w-6 h-6 text-orange-600" />
          <span className="font-semibold text-orange-600">Tambahkan Assessment</span>
        </div>
      </button>
    </div>
  )
}

export default QuestionsListSection