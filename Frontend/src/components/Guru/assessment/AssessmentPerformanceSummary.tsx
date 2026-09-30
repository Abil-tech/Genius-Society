import { PlusCircle } from 'lucide-react'
import SegmentedBar from './SegmentedBar'
import type { GuruAssessmentsResponse } from '../../../types/Guru/guruAssessmentsResponse'

interface Props {
  performance: GuruAssessmentsResponse['performance']
  onCreate: () => void
}

export default function AssessmentPerformanceSummary({ performance, onCreate }: Props) {
  const { averageScore, averageScoreDelta, completionRate, monitoringCount } = performance
  const deltaLabel = `${averageScoreDelta >= 0 ? '+' : ''}${averageScoreDelta}%`

  return (
    <section className="rounded-md border border-[#EBD3C0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-[#EBD3C0] pb-4">
        <h2 className="text-2xl font-extrabold text-[#2B211A]">Performance Summary</h2>
        <button
          type="button"
          onClick={onCreate}
          className="flex items-center gap-2 rounded-sm bg-[#FF9500] px-4 py-2 font-mono text-[11px] font-bold uppercase text-[#2B211A] hover:bg-[#E68600]"
        >
          <PlusCircle className="h-4 w-4" />
          Buat Ujian Baru
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 font-mono sm:grid-cols-3">
        <div>
          <p className="text-[10px] uppercase text-[#7A6A5C]">Nilai Rata-Rata</p>
          <p className="mt-1 text-2xl font-bold text-[#2B211A]">
            {averageScore.toFixed(1)}{' '}
            <span className="text-[11px] font-normal text-[#8B4E00]">{deltaLabel}</span>
          </p>
          <SegmentedBar percent={averageScore} />
        </div>

        <div>
          <p className="text-[10px] uppercase text-[#7A6A5C]">Completion_Rate</p>
          <p className="mt-1 text-2xl font-bold text-[#2B211A]">
            {completionRate.toFixed(1)}%{' '}
            {completionRate >= 100 && (
              <span className="text-[11px] font-bold text-[#0A6B8A]">MAX</span>
            )}
          </p>
          <SegmentedBar percent={completionRate} />
        </div>

        <div>
          <p className="text-[10px] uppercase text-[#7A6A5C]">Aksi</p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-[#2B211A]">
            {String(monitoringCount).padStart(2, '0')}
            <span className="rounded-sm bg-[#FFE8D8] px-2 py-0.5 text-[9px] font-normal uppercase text-[#7A6A5C]">
              Monitoring
            </span>
          </p>
          <div className="mt-3 flex gap-1" aria-hidden>
            {Array.from({ length: Math.min(monitoringCount, 5) }).map((_, i) => (
              <span key={i} className="h-1 w-2 rounded-full bg-[#8B4E00]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}