// Frontend/src/components/Guru/assessment/BasicInfoSection.tsx

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface DropdownOption { value: string; label: string }

interface BasicInfoSectionProps {
  judul: string
  mataPelajaran: string   // subjectId
  tingkatKelas: string    // classId
  onJudulChange: (value: string) => void
  onMataPelajaranChange: (value: string) => void
  onTingkatKelasChange: (value: string) => void
  /** Passed from parent — real subjects from DB */
  subjectOptions?: DropdownOption[]
  /** Passed from parent — real classes from DB */
  classOptions?: DropdownOption[]
}

export const BasicInfoSection = ({
  judul,
  mataPelajaran,
  tingkatKelas,
  onJudulChange,
  onMataPelajaranChange,
  onTingkatKelasChange,
  subjectOptions = [],
  classOptions = [],
}: BasicInfoSectionProps) => {
  const [dropdownOpen, setDropdownOpen] = useState<'mapel' | 'kelas' | null>(null)

  const selectedSubjectLabel = subjectOptions.find(s => s.value === mataPelajaran)?.label
  const selectedClassLabel   = classOptions.find(c => c.value === tingkatKelas)?.label

  return (
    <div className="rounded-2xl border border-brand-navy/10 bg-white p-6">
      <div className="mb-6 flex items-start gap-2">
        <span className="text-2xl">ℹ️</span>
        <h2 className="text-lg font-bold text-gray-900">Informasi Dasar</h2>
      </div>

      <div className="space-y-4">
        {/* Judul Asesmen */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Judul Asesmen <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={judul}
            onChange={(e) => onJudulChange(e.target.value)}
            placeholder="e.g., Ujian Akhir Semester - Teknik Mesin"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* Mata Pelajaran */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Mata Pelajaran <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(dropdownOpen === 'mapel' ? null : 'mapel')}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 flex items-center justify-between"
            >
              <span className={selectedSubjectLabel ? 'text-gray-900' : 'text-gray-400'}>
                {selectedSubjectLabel || (subjectOptions.length === 0 ? 'Memuat...' : 'Pilih Mata Pelajaran...')}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen === 'mapel' ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen === 'mapel' && subjectOptions.length > 0 && (
              <div className="absolute top-full mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-10 max-h-52 overflow-y-auto">
                {subjectOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onMataPelajaranChange(option.value)
                      setDropdownOpen(null)
                    }}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-orange-50 first:rounded-t-lg last:rounded-b-lg ${
                      mataPelajaran === option.value
                        ? 'bg-orange-50 font-semibold text-orange-600'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kelas */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Kelas <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(dropdownOpen === 'kelas' ? null : 'kelas')}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 flex items-center justify-between"
            >
              <span className={selectedClassLabel ? 'text-gray-900' : 'text-gray-400'}>
                {selectedClassLabel || (classOptions.length === 0 ? 'Memuat...' : 'Pilih Kelas...')}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen === 'kelas' ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen === 'kelas' && classOptions.length > 0 && (
              <div className="absolute top-full mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-10 max-h-52 overflow-y-auto">
                {classOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onTingkatKelasChange(option.value)
                      setDropdownOpen(null)
                    }}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-orange-50 first:rounded-t-lg last:rounded-b-lg ${
                      tingkatKelas === option.value
                        ? 'bg-orange-50 font-semibold text-orange-600'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicInfoSection