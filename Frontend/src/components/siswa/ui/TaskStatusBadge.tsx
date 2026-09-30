import type { TaskStatus } from '../../types/student'

const config: Record<TaskStatus, { label: string; className: string }> = {
  not_started: { label: 'Belum dikerjakan', className: 'bg-brand-soft text-brand-strong' },
  submitted: { label: 'Terkumpul', className: 'bg-ok-bg text-ok-fg' },
  graded: { label: 'Sudah dinilai', className: 'bg-ok-bg text-ok-fg' },
  overdue: { label: 'Terlambat', className: 'bg-danger-bg text-danger-fg' },
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const { label, className } = config[status]
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded px-2 py-0.5 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  )
}
