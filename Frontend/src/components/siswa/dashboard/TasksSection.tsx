import type { DashboardTaskItem, TaskKind } from '../../types/student'
import { formatDue } from '../../utils/date'
import { Card } from '../ui/Card'
import { SectionHeading } from '../ui/SectionHeading'
import { StateMessage } from '../ui/StateMessage'
import { TaskStatusBadge } from '../ui/TaskStatusBadge'

const kindLabel: Record<TaskKind, string> = {
  assignment: 'Tugas',
  project: 'Projek',
  assessment: 'Asesmen',
}

export function TasksSection({ tasks, className = '' }: { tasks: DashboardTaskItem[]; className?: string }) {
  return (
    <section aria-labelledby="sec-tasks" className={`flex min-w-0 flex-col gap-3 ${className}`}>
      <SectionHeading id="sec-tasks" title="Tugas & Asesmen" />
      <Card className="flex-1 overflow-hidden">
        {tasks.length === 0 ? (
          <StateMessage
            variant="empty"
            title="Tidak ada tugas atau asesmen aktif"
            description="Tugas dan asesmen baru dari guru akan muncul di sini."
          />
        ) : (
          <ul className="divide-y divide-line">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="min-w-0">
                  <p className="font-semibold [overflow-wrap:anywhere]">{t.title}</p>
                  <p className="mt-0.5 text-sm text-ink-soft [overflow-wrap:anywhere]">
                    <span className="font-mono text-xs">{kindLabel[t.kind]}</span> · {t.subjectName}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 sm:flex-col sm:items-end sm:gap-1">
                  <span className="font-mono text-xs text-ink-soft">{formatDue(t.dueAt)}</span>
                  <TaskStatusBadge status={t.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  )
}
