import type { ReactNode } from 'react'
import { CalendarClock, ClipboardList, GraduationCap, ListChecks } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { StudentDashboard } from '../../types/student'
import { formatDue } from '../../utils/date'
import { formatScore } from '../../utils/format'
import { Card } from '../ui/Card'

interface StatProps {
  label: string
  icon: LucideIcon
  children: ReactNode
}

function Stat({ label, icon: Icon, children }: StatProps) {
  return (
    <Card className="flex flex-col gap-3 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2 border-b border-line pb-2">
        <h3 className="min-w-0 font-mono text-xs text-ink-soft">{label}</h3>
        <Icon aria-hidden className="size-5 shrink-0 text-brand-strong" />
      </div>
      {children}
    </Card>
  )
}

export function SummaryCards({ summary }: { summary: StudentDashboard['summary'] }) {
  const { averageScore, assignmentsCompleted, assignmentsTotal, upcomingAssessments, nearestDeadline } =
    summary
  const progress =
    assignmentsTotal > 0 ? Math.round((assignmentsCompleted / assignmentsTotal) * 100) : 0

  return (
    <section aria-label="Ringkasan" className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Stat label="Rata-rata nilai" icon={GraduationCap}>
        <p className="text-4xl font-bold leading-none">
          {formatScore(averageScore)}
          <span className="ml-1 text-sm font-medium text-ink-soft">/ 100</span>
        </p>
        <p className="text-sm text-ink-soft">Nilai akhir semua mata pelajaran semester ini.</p>
      </Stat>

      <Stat label="Tugas selesai" icon={ListChecks}>
        <p className="text-4xl font-bold leading-none">
          {assignmentsCompleted}
          <span className="ml-1 text-sm font-medium text-ink-soft">/ {assignmentsTotal}</span>
        </p>
        <div
          role="progressbar"
          aria-label="Tugas selesai"
          aria-valuemin={0}
          aria-valuemax={assignmentsTotal}
          aria-valuenow={assignmentsCompleted}
          className="h-1.5 w-full overflow-hidden rounded-full bg-cream-200"
        >
          <div className="h-full bg-brand" style={{ width: `${progress}%` }} />
        </div>
      </Stat>

      <Stat label="Asesmen mendatang" icon={ClipboardList}>
        <p className="text-4xl font-bold leading-none">{upcomingAssessments}</p>
        <p className="text-sm text-ink-soft">
          {upcomingAssessments === 0 ? 'Belum ada asesmen terjadwal.' : 'Belum dikerjakan.'}
        </p>
      </Stat>

      <Stat label="Deadline terdekat" icon={CalendarClock}>
        {nearestDeadline ? (
          <>
            <p className="line-clamp-2 text-lg font-semibold leading-snug [overflow-wrap:anywhere]">
              {nearestDeadline.title}
            </p>
            <p className="text-sm text-ink-soft [overflow-wrap:anywhere]">
              {formatDue(nearestDeadline.dueAt)} · {nearestDeadline.subjectName}
            </p>
          </>
        ) : (
          <p className="text-sm text-ink-soft">Tidak ada tugas atau projek yang menunggu.</p>
        )}
      </Stat>
    </section>
  )
}
