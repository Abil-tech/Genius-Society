import { Eye, Pencil, Archive, Trash2 } from 'lucide-react'
import type { Task } from '../../../types/task'
import { taskStatusLabel, taskStatusTone } from '../../../utils/taskManagementContent'
import { formatDate, formatTime } from '../../../utils/dateFormat'
import RowActionMenu from '../../admin/RowActionMenu'

interface TaskManagementCardListProps {
  data: Task[]
  onView: (task: Task) => void
  onEdit: (task: Task) => void
  onArchive: (task: Task) => void
  onDelete: (task: Task) => void
}

export default function TaskManagementCardList({
  data,
  onView,
  onEdit,
  onArchive,
  onDelete,
}: TaskManagementCardListProps) {
  return (
    <div className="space-y-3 sm:hidden">
      {data.map((task) => (
        <div
          key={task.id}
          onClick={() => onView(task)}
          className="rounded-xl border border-brand-navy/10 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-brand-navy">{task.title}</p>
              <p className="text-xs text-brand-muted">{task.teacher}</p>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <RowActionMenu
                actions={[
                  { label: 'Lihat Detail', icon: Eye, onClick: () => onView(task) },
                  { label: 'Edit', icon: Pencil, onClick: () => onEdit(task) },
                  { label: 'Arsipkan', icon: Archive, onClick: () => onArchive(task) },
                  {
                    label: 'Hapus',
                    icon: Trash2,
                    tone: 'danger',
                    onClick: () => onDelete(task),
                  },
                ]}
              />
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-brand-muted">
            <span>{task.subject}</span>
            <span>•</span>
            <span>{task.classNames.join(', ')}</span>
          </div>

          <div className="mt-2.5 flex items-center justify-between">
            <div className="text-xs text-brand-muted">
              <p>
                {formatDate(task.deadline)} • {formatTime(task.deadline)}
              </p>
              <p className="mt-0.5 text-brand-navy">
                {task.submissionSubmitted} / {task.submissionTotal} mengumpulkan
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${taskStatusTone[task.status]}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {taskStatusLabel[task.status]}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}