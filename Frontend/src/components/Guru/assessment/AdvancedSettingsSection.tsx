// Frontend/src/components/Guru/assessment/AdvancedSettingsSection.tsx

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
// Sesuaikan path import ini dengan struktur folder Anda yang sebenarnya
import { VISIBILITAS_OPTIONS } from '../../../types/Guru/createAssessmentTypes'

interface AdvancedSettingsSectionProps {
  jadwalMulai: string
  jadwalMulaiTime: string
  jadwalSelesai: string
  jadwalSelesaiTime: string
  acakPertanyaan: boolean
  visibilitasNilai: boolean // Diubah dari string ke boolean
  onJadwalMulaiChange: (date: string, time: string) => void
  onJadwalSelesaiChange: (date: string, time: string) => void
  onAcakPertanyaanChange: (value: boolean) => void
  onVisibilitasNilaiChange: (value: boolean) => void // Diubah dari string ke boolean
}

export const AdvancedSettingsSection = ({
  jadwalMulai,
  jadwalMulaiTime,
  jadwalSelesai,
  jadwalSelesaiTime,
  acakPertanyaan,
  visibilitasNilai,
  onJadwalMulaiChange,
  onJadwalSelesaiChange,
  onAcakPertanyaanChange,
  onVisibilitasNilaiChange,
}: AdvancedSettingsSectionProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-brand-navy/10 bg-white p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">⚙️</span>
          <h3 className="font-bold text-gray-900">PENGATURAN_LANJUTAN</h3>
        </div>
        <div className="h-1 w-16 bg-orange-500 rounded-full"></div>
      </div>

      <div className="space-y-5">
        {/* Jadwal Mulai */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Jadwal Mulai
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={jadwalMulai}
              onChange={(e) =>
                onJadwalMulaiChange(e.target.value, jadwalMulaiTime)
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <input
              type="time"
              value={jadwalMulaiTime}
              onChange={(e) => onJadwalMulaiChange(jadwalMulai, e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="--:--"
            />
          </div>
        </div>

        {/* Jadwal Selesai */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Jadwal Selesai
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={jadwalSelesai}
              onChange={(e) =>
                onJadwalSelesaiChange(e.target.value, jadwalSelesaiTime)
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <input
              type="time"
              value={jadwalSelesaiTime}
              onChange={(e) =>
                onJadwalSelesaiChange(jadwalSelesai, e.target.value)
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="--:--"
            />
          </div>
        </div>

        {/* Acak Pertanyaan */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
          <label className="text-sm font-medium text-gray-700">
            Acak Pertanyaan
          </label>
          <button
            onClick={() => onAcakPertanyaanChange(!acakPertanyaan)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              acakPertanyaan ? 'bg-orange-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                acakPertanyaan ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Visibilitas Nilai */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Visibilitas Nilai
          </label>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 flex items-center justify-between"
            >
              <span>
                {/* Menggunakan VISIBILITAS_OPTIONS */}
                {VISIBILITAS_OPTIONS.find((v) => v.value === visibilitasNilai)
                  ?.label || 'Pilih Opsi...'}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-20">
                {/* Menggunakan VISIBILITAS_OPTIONS */}
                {VISIBILITAS_OPTIONS.map((option) => (
                  <button
                    key={String(option.value)} // Konversi boolean ke string untuk key
                    onClick={() => {
                      onVisibilitasNilaiChange(option.value)
                      setDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-orange-50 first:rounded-t-lg last:rounded-b-lg ${
                      visibilitasNilai === option.value
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

export default AdvancedSettingsSection