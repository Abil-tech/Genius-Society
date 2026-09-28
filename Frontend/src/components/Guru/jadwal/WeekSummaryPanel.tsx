import type { WeekSummary } from '../../../types/Guru/teachingSchedule'

interface WeekSummaryPanelProps {
  summary: WeekSummary
}

export default function WeekSummaryPanel({ summary }: WeekSummaryPanelProps) {
  return (
    <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-brand-muted">
        Log_Summary_W12
      </p>

      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="text-4xl font-extrabold text-brand-navy">
          {summary.totalHours}
        </span>
        <span className="text-base font-bold text-brand-navy/60">Jam</span>
      </p>
      <p className="mt-1 text-xs text-brand-muted">
        Total Jam Mengajar Minggu Ini
      </p>

      <div className="mt-5 rounded-xl border border-brand-navy/5 bg-brand-bg p-3.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-brand-muted">
            Progress_KPI
          </span>
          <span className="text-sm font-bold text-brand-orange">
            {summary.kpiProgress}%
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-brand-orange"
            style={{ width: `${summary.kpiProgress}%` }}
          />
        </div>
      </div>

      {summary.nextClass && (
        <div className="mt-4 border-l-2 border-brand-orange bg-brand-orange-light/40 py-2.5 pl-3.5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-brand-orange">
            Next_Class
          </p>
          <p className="mt-1 text-sm font-bold text-brand-navy">
            {summary.nextClass.subject} - {summary.nextClass.time}
          </p>
        </div>
      )}
    </div>
  )
}