import { activityLog as fallbackData } from '../../utils/dashboardContent'
import type { ActivityLogItem } from '../../types/Dashboard'

const toneClasses: Record<string, string> = {
  orange: 'bg-brand-orange-light text-brand-orange',
  navy: 'bg-blue-50 text-blue-600',
  success: 'bg-status-success-bg text-status-success',
  muted: 'bg-brand-bg text-brand-muted',
}

const toneDot: Record<string, string> = {
  orange: 'bg-brand-orange',
  navy: 'bg-blue-500',
  success: 'bg-status-success',
  muted: 'bg-brand-navy/30',
}

interface ActivityLogCardProps {
  data?: ActivityLogItem[]
}

export default function ActivityLogCard({ data = fallbackData }: ActivityLogCardProps) {
  const logs = data && data.length > 0 ? data : fallbackData

  return (
    <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-brand-navy">Aktivitas Terbaru</h3>
        <span className="rounded-full bg-brand-bg px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-brand-muted">
          Real-Time Sync
        </span>
      </div>

      <div className="mt-3 divide-y divide-brand-navy/5">
        {logs.map((item, idx) => (
          <div
            key={`${item.actor}-${item.time}-${idx}`}
            className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${toneDot[item.tone] || 'bg-brand-navy/30'}`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-brand-navy">
                <span className="font-bold">{item.actor}</span>{' '}
                {item.action}
              </p>
              <p className="mt-0.5 text-xs text-brand-muted">{item.detail}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${toneClasses[item.tone] || toneClasses.muted}`}
              >
                {item.tag}
              </span>
              <span className="text-[10px] text-brand-muted">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}