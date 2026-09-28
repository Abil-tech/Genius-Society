import { systemNotifications as fallbackData } from '../../utils/dashboardContent'
import type { SystemNotification } from '../../types/Dashboard'

const toneDot: Record<string, string> = {
  navy: 'bg-brand-navy',
  orange: 'bg-brand-orange',
  muted: 'bg-brand-navy/30',
}

interface NotificationsPanelProps {
  data?: SystemNotification[]
}

export default function NotificationsPanel({ data = fallbackData }: NotificationsPanelProps) {
  const notifications = data && data.length > 0 ? data : fallbackData

  return (
    <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-brand-navy">
          Notifikasi & Log Sistem
        </h3>
        <span className="rounded-full bg-brand-orange px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-white">
          {notifications.length} Baru
        </span>
      </div>

      <div className="mt-3 divide-y divide-brand-navy/5">
        {notifications.map((item, idx) => (
          <div key={`${item.title}-${idx}`} className="flex gap-2.5 py-3 first:pt-0 last:pb-0">
            <span
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${toneDot[item.tone] || 'bg-brand-navy/30'}`}
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-brand-navy">{item.title}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-brand-muted">
                {item.description}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-brand-navy/40">
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}