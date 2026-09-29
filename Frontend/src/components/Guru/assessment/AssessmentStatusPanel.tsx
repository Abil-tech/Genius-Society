import type { GuruAssessmentsResponse } from '../../../types/Guru/guruAssessmentsResponse'

interface Props {
  summary: GuruAssessmentsResponse['statusSummary']
  onDownloadReport: () => void
  isDownloading?: boolean
}

export default function AssessmentStatusPanel({ summary, onDownloadReport, isDownloading }: Props) {
  const rows = [
    { label: 'Total Assessments', value: summary.totalAssessments, accent: false },
    { label: 'Pending Reviews', value: summary.pendingReviews, accent: true },
    { label: 'Success Rate', value: `${summary.successRate}%`, accent: false },
  ]

  return (
    <aside className="rounded-md border border-[#EBD3C0] bg-[#F7E3D3] p-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-[#7A6A5C]">
        Ringkasan Status
      </p>
      <dl className="mt-3">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between border-b border-[#EBD3C0] py-2 last:border-b-0"
          >
            <dt className="text-sm text-[#2B211A]">{r.label}</dt>
            <dd className={`text-sm font-bold ${r.accent ? 'text-[#8B4E00]' : 'text-[#2B211A]'}`}>
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
      <button
        type="button"
        onClick={onDownloadReport}
        disabled={isDownloading}
        className="mt-4 w-full rounded-sm border border-[#CFC3B8] bg-white py-1.5 font-mono text-[11px] uppercase text-[#2B211A] hover:bg-[#FFF3EA] disabled:opacity-60"
      >
        {isDownloading ? 'Mengunduh...' : 'Laporan.pdf'}
      </button>
    </aside>
  )
}