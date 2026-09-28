import { userSummary as fallbackData } from '../../utils/dashboardContent'
import type { UserSummaryItem } from '../../types/Dashboard'

const toneClass: Record<string, string> = {
  orange: 'bg-brand-orange',
  navy: 'bg-brand-navy',
  muted: 'bg-brand-navy/25',
}

interface UserSummaryCardProps {
  data?: UserSummaryItem[]
}

export default function UserSummaryCard({ data = fallbackData }: UserSummaryCardProps) {
  const summaryData = data && data.length > 0 ? data : fallbackData
  const total = summaryData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-brand-navy">
          Ringkasan Pengguna
        </h3>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-brand-muted">
          Total {total.toLocaleString('id-ID')}
        </span>
      </div>

      <div className="mt-4 space-y-3.5">
        {summaryData.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-brand-muted">{item.label}</span>
              <span className="font-semibold text-brand-navy">
                {item.value.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-brand-bg">
              <div
                className={`h-full rounded-full ${toneClass[item.tone] || 'bg-brand-navy'}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}