// Frontend/src/components/Guru/assessment/ConfigurationPanel.tsx

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { TIPE_ASESMEN_OPTIONS } from '../../../types/Guru/createAssessmentTypes'

interface ConfigurationPanelProps {
  tipeAsesmen: string
  durasi: number
  passingGrade: number
  onTipeAsesmenChange: (value: string) => void
  onDurasiChange: (value: number) => void
  onPassingGradeChange: (value: number) => void
}

export const ConfigurationPanel = ({
  tipeAsesmen,
  durasi,
  passingGrade,
  onTipeAsesmenChange,
  onDurasiChange,
  onPassingGradeChange,
}: ConfigurationPanelProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-brand-navy/10 bg-white p-6 sticky top-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">⚙️</span>
          <h3 className="font-bold text-gray-900">KONFIGURASI_ASESMEN</h3>
        </div>
        <div className="h-1 w-16 bg-orange-500 rounded-full"></div>
      </div>

      <div className="space-y-5">
        {/* Tipe Asesmen */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Tipe Asesmen
          </label>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 flex items-center justify-between"
            >
              <span>
                {TIPE_ASESMEN_OPTIONS.find((t) => t.value === tipeAsesmen)
                  ?.label || 'Pilih Tipe...'}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-20">
                {TIPE_ASESMEN_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onTipeAsesmenChange(option.value)
                      setDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-orange-50 first:rounded-t-lg last:rounded-b-lg ${
                      tipeAsesmen === option.value
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

        {/* Durasi */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Durasi (Menit)
          </label>
          <input
            type="number"
            value={durasi}
            onChange={(e) => onDurasiChange(parseInt(e.target.value) || 0)}
            min="5"
            max="480"
            step="5"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <p className="text-xs text-gray-500 mt-1">5 - 480 menit</p>
        </div>

        {/* Passing Grade */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Passing Grade
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={passingGrade}
              onChange={(e) => onPassingGradeChange(parseInt(e.target.value) || 0)}
              min="0"
              max="100"
              step="1"
              className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-700">%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">0 - 100</p>
        </div>
      </div>
    </div>
  )
}

export default ConfigurationPanel