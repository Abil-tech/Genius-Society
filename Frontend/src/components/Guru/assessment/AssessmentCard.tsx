import { ArrowRight, BadgeCheck, CalendarDays, LineChart, Pencil } from 'lucide-react'
import type { GuruAssessmentItem } from '../../../types/Guru/guruAssessmentsResponse'

function formatDuration(seconds?: number) {
  if (seconds == null) return '-'
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, '0')}s`
}

function formatStartDate(iso?: string) {
  if (!iso) return { date: '-', time: '-' }
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return { date: `${dd}-${mm}-${String(d.getFullYear()).slice(2)}`, time: `${hh}.${mi} WIB` }
}

function timeAgo(iso?: string) {
  if (!iso) return '-'
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days <= 0) return 'Hari ini'
  return `${days} days ago`
}

const STATUS_STYLE = {
  active: { badge: 'bg-[#FFE8D8] text-[#8B4E00]', tab: 'bg-[#FF9500] text-[#2B211A]', label: 'Active' },
  scheduled: { badge: 'bg-[#EDEAE6] text-[#5C5148]', tab: 'bg-[#E4E0DB] text-[#5C5148]', label: 'Scheduled' },
  completed: { badge: 'bg-[#F3E5DA] text-[#7A6A5C]', tab: 'bg-[#EFDCCB] text-[#7A6A5C]', label: 'Completed' },
} as const

interface Props {
  item: GuruAssessmentItem
  onOpen: (item: GuruAssessmentItem) => void
  onEdit: (item: GuruAssessmentItem) => void
  onVerify: (item: GuruAssessmentItem) => void
  onDownloadRanking: (item: GuruAssessmentItem) => void
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[9px] uppercase text-[#7A6A5C]">{label}</p>
      <p className={`mt-1 text-sm font-bold ${accent ? 'text-[#8B4E00]' : 'text-[#2B211A]'}`}>
        {value}
      </p>
    </div>
  )
}

export default function AssessmentCard({ item, onOpen, onEdit, onVerify, onDownloadRanking }: Props) {
  const style = STATUS_STYLE[item.status]
  const Icon = item.status === 'active' ? LineChart : item.status === 'scheduled' ? CalendarDays : BadgeCheck
  const isCompleted = item.status === 'completed'
  const start = formatStartDate(item.startDate)

  return (
    <article className="relative rounded-md border border-[#EBD3C0] bg-white p-5 pt-6 shadow-sm">
      <span className={`absolute -top-2.5 left-0 rounded-t-sm px-2 py-0.5 font-mono text-[9px] uppercase ${style.tab}`}>
        {item.code}
      </span>

      <div className="flex items-start justify-between">
        <span className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase ${style.badge}`}>
          {style.label}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#FFEFE3] text-[#8B4E00]">
          <Icon className="h-4 w-4" />
        </span>
      </div>

      <h3 className={`mt-3 text-xl font-extrabold ${isCompleted ? 'text-[#5C5148]' : 'text-[#2B211A]'}`}>
        {item.title}
      </h3>
      <p className="mt-1 text-sm text-[#7A6A5C]">{item.description}</p>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[#F1E3D7] pt-4 font-mono">
        {item.status === 'active' && (
          <>
            <Stat label="Durasi" value={`${item.durationMinutes} Min`} />
            <Stat label="Murid" value={`${item.participantCount ?? 0} / ${item.totalStudents}`} />
            <Stat label="Waktu Rata-Rata" value={formatDuration(item.avgTimeSeconds)} />
          </>
        )}
        {item.status === 'scheduled' && (
          <>
            <Stat label="Tanggal Mulai" value={start.date} />
            <Stat label="Murid" value={String(item.totalStudents)} />
            <Stat label="Status" value={item.isReady ? 'READY' : 'DRAFT'} />
          </>
        )}
        {item.status === 'completed' && (
          <>
            <Stat label="Finished" value={timeAgo(item.finishedAt)} />
            <Stat label="Nilai Rata-Rata" value={`${item.averageScore ?? 0} / 100`} accent />
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F1E3D7] pt-4 font-mono">
        {item.status === 'active' && (
          <>
            <div className="flex items-center gap-2">
              <div className="h-1 w-20 rounded-full bg-[#EFE3D8]">
                <div
                  className="h-1 rounded-full bg-[#8B4E00]"
                  style={{ width: `${item.processedPercent ?? 0}%` }}
                />
              </div>
              <span className="text-[10px] text-[#2B211A]">{item.processedPercent ?? 0}% Processed</span>
            </div>
            <button
              type="button"
              onClick={() => onOpen(item)}
              className="flex items-center gap-1 text-[10px] font-bold uppercase text-[#8B4E00] hover:underline"
            >
              View_Dashboard <ArrowRight className="h-3 w-3" />
            </button>
          </>
        )}

        {item.status === 'scheduled' && (
          <>
            <span className="text-[10px] uppercase text-[#7A6A5C]">Mulai : {start.time}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Edit assessment"
                onClick={() => onEdit(item)}
                className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#CFC3B8] text-[#5C5148] hover:bg-[#FFF3EA]"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onVerify(item)}
                className="rounded-sm bg-[#00B8FF] px-4 py-1.5 text-[10px] font-bold uppercase text-white hover:bg-[#00A3E0]"
              >
                Re-verify
              </button>
            </div>
          </>
        )}

        {item.status === 'completed' && (
          <>
            <div className="flex items-center -space-x-1.5">
              {item.topStudents?.slice(0, 2).map((initial) => (
                <span
                  key={initial}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-[#F3D9C4] text-[8px] font-bold text-[#5C5148]"
                >
                  {initial}
                </span>
              ))}
              {item.totalStudents > 2 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-[#CDE6FA] text-[8px] font-bold text-[#2B211A]">
                  +{item.totalStudents - 2}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDownloadRanking(item)}
              className="border-b border-[#7A6A5C] text-[10px] uppercase text-[#5C5148] hover:text-[#2B211A]"
            >
              Download Peringkat
            </button>
          </>
        )}
      </div>
    </article>
  )
}