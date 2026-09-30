import { Award, Bell, FileCheck2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ActivityItem, ActivityType } from '../../types/student'
import { formatRelative } from '../../utils/date'
import { Card } from '../ui/Card'
import { SectionHeading } from '../ui/SectionHeading'
import { StateMessage } from '../ui/StateMessage'

const icons: Record<ActivityType, LucideIcon> = {
  submission: FileCheck2,
  grade: Award,
  notification: Bell,
}

const typeLabel: Record<ActivityType, string> = {
  submission: 'Pengumpulan',
  grade: 'Nilai',
  notification: 'Notifikasi',
}

export function ActivitySection({ activities, className = '' }: { activities: ActivityItem[]; className?: string }) {
  return (
    <section aria-labelledby="sec-activity" className={`flex min-w-0 flex-col gap-3 ${className}`}>
      <SectionHeading id="sec-activity" title="Aktivitas Terbaru" />
      <Card className="flex-1">
        {activities.length === 0 ? (
          <StateMessage variant="empty" title="Belum ada aktivitas" description="Pengumpulan, nilai, dan notifikasi terbaru akan muncul di sini." />
        ) : (
          <ul className="divide-y divide-line">
            {activities.map((a) => {
              const Icon = icons[a.type]
              return (
                <li key={a.id} className="flex gap-3 p-4">
                  <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm [overflow-wrap:anywhere]">
                      <span className="sr-only">{typeLabel[a.type]}: </span>
                      {a.message}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-ink-soft">{formatRelative(a.occurredAt)}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </section>
  )
}
