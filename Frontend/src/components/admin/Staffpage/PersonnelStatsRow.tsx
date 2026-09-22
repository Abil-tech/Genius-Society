import { personnelStats } from '../../../utils/Staff/personnelContent'

export default function PersonnelStatsRow() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {personnelStats.map((stat) => (
        <div
          key={stat.code}
          className={`rounded-2xl border bg-white p-5 ${
            stat.highlighted
              ? 'border-brand-orange/40 shadow-[0_0_0_1px_rgba(247,148,29,0.15)]'
              : 'border-brand-navy/5'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-brand-muted">
                {stat.code}
              </p>
              <p className="mt-0.5 text-xs font-medium text-brand-navy/70">
                {stat.label}
              </p>
            </div>
            {stat.topBadge && (
              <span className="rounded-full bg-brand-orange-light px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-brand-orange">
                {stat.topBadge}
              </span>
            )}
          </div>

          <div className="mt-3 flex items-end justify-between">
            <p className="text-3xl font-extrabold text-brand-navy">
              {stat.value}
            </p>
            <stat.icon
              size={26}
              strokeWidth={1.5}
              className="text-brand-orange/70"
            />
          </div>

          {stat.secondary ? (
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="font-bold text-brand-orange">
                {stat.secondary.value}
              </span>
              <span className="text-brand-muted">{stat.secondary.label}</span>
            </div>
          ) : (
            stat.trend && (
              <p className="mt-2 text-[11px] font-medium text-status-success">
                &#10003; {stat.trend}
              </p>
            )
          )}

          {stat.note && (
            <p className="mt-0.5 text-right font-mono text-[9px] uppercase tracking-wide text-brand-muted">
              {stat.note}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}