import { userSummary } from '../../utils/dashboardContent'

const toneClass: Record<string, string> = {
  orange: 'bg-brand-orange',
  navy: 'bg-brand-navy',
  muted: 'bg-brand-navy/25',
}

export default function UserSummaryCard() {
  const total = userSummary.reduce((sum, item) => sum + item.value, 0)

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
        {userSummary.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-brand-muted">{item.label}</span>
              <span className="font-semibold text-brand-navy">
                {item.value.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-brand-bg">
              <div
                className={`h-full rounded-full ${toneClass[item.tone]}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}