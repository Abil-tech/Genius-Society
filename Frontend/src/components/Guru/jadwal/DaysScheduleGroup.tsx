import ClassScheduleCard from './ClassScheduleCard'
import type { ScheduleDay } from '../../../types/Guru/teachingSchedule'

interface DayScheduleGroupProps {
  day: ScheduleDay
}

export default function DayScheduleGroup({ day }: DayScheduleGroupProps) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <h2 className="whitespace-nowrap text-lg font-extrabold text-brand-navy">
          {day.day}, {day.date}
        </h2>
        <div className="h-px flex-1 bg-brand-navy/10" />
        <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-brand-muted">
          {String(day.sessions.length).padStart(2, '0')}_
          {day.sessions.length > 1 ? 'Classes' : 'Class'}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {day.sessions.map((session) => (
          <ClassScheduleCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  )
}