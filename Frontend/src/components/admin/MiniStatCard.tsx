import type { MiniStatCard as MiniStatCardType } from '../../types/Dashboard'

export default function MiniStatCard({
  label,
  value,
  badge,
  icon: Icon,
  highlighted,
}: MiniStatCardType) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 ${
        highlighted ? 'border-brand-orange/40' : 'border-brand-navy/5'
      }`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange-light text-brand-orange">
        <Icon size={16} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-brand-muted">{label}</p>
        <p className="text-lg font-bold text-brand-navy">{value}</p>
      </div>
      <span className="shrink-0 rounded-full bg-brand-bg px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide text-brand-muted">
        {badge}
      </span>
    </div>
  )
}