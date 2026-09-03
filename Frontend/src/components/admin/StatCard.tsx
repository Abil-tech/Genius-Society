import type { StatCard as StatCardType } from '../../types/Dashboard'

export default function StatCard({
  code,
  label,
  value,
  trend,
  trendTone,
  badge,
  icon: Icon,
  highlighted,
}: StatCardType) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 ${
        highlighted
          ? 'border-brand-orange/40 shadow-[0_0_0_1px_rgba(247,148,29,0.15)]'
          : 'border-brand-navy/5'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-brand-muted">
            {code}
          </p>
          <p className="mt-0.5 text-xs font-medium text-brand-navy/70">
            {label}
          </p>
        </div>
        {badge && (
          <span className="rounded-full bg-brand-orange-light px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-brand-orange">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-end justify-between">
        <p className="text-3xl font-extrabold text-brand-navy">{value}</p>
        <Icon size={26} strokeWidth={1.5} className="text-brand-orange/70" />
      </div>

      {trend && (
        <p
          className={`mt-2 text-[11px] font-medium ${
            trendTone === 'positive' ? 'text-status-success' : 'text-brand-muted'
          }`}
        >
          {trend}
        </p>
      )}
    </div>
  )
}