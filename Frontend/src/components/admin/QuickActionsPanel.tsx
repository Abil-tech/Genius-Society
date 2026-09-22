import { quickActions } from '../../utils/dashboardContent'

export default function QuickActionsPanel() {
  return (
    <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange-light/40 p-5">
      <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-brand-orange">
        Panel Kontrol Cepat
      </h3>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {quickActions.map((action) => (
          <button
            key={action.label}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-brand-orange/20 bg-white py-3 text-brand-navy transition-colors hover:border-brand-orange hover:bg-brand-orange-light"
          >
            <action.icon size={17} strokeWidth={2} className="text-brand-orange" />
            <span className="text-[11px] font-semibold">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}