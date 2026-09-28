import { MapPin } from 'lucide-react'
import type { ClassSession } from '../../../types/Guru/teachingSchedule'

const statusTone: Record<ClassSession['status'], string> = {
  selesai: 'bg-status-success-bg text-status-success',
  berlangsung: 'bg-brand-orange text-white',
  mendatang: 'bg-brand-bg text-brand-navy/50',
}

const statusLabel: Record<ClassSession['status'], string> = {
  selesai: 'Selesai',
  berlangsung: 'Berlangsung',
  mendatang: 'Mendatang',
}

interface ClassScheduleCardProps {
  session: ClassSession
}

export default function ClassScheduleCard({ session }: ClassScheduleCardProps) {
  const isOngoing = session.status === 'berlangsung'

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border bg-white p-4 ${
        isOngoing
          ? 'border-brand-orange border-l-4 shadow-[0_0_0_1px_rgba(247,148,29,0.15)]'
          : 'border-brand-navy/5'
      }`}
    >
      <div className="w-14 shrink-0 text-center">
        <p className="text-sm font-bold text-brand-navy">{session.startTime}</p>
        <p className="text-[10px] text-brand-muted">{session.endTime}</p>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-brand-navy">{session.subject}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-brand-muted">
          <MapPin size={11} strokeWidth={2} />
          {session.className}
          {session.room && (
            <>
              <span className="text-brand-navy/20">•</span>
              {session.room}
            </>
          )}
        </p>
      </div>

      <span
        className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wide ${statusTone[session.status]}`}
      >
        {statusLabel[session.status]}
      </span>
    </div>
  )
}