import { Eye, Pencil, Archive, Trash2 } from 'lucide-react'
import type { Task } from '../../../types/task'
import { taskStatusLabel, taskStatusTone } from '../../../utils/taskManagementContent'
import { formatDate, formatTime, daysUntil } from '../../../utils/dateFormat'
import RowActionMenu from '../../admin/RowActionMenu'

interface TaskManagementTableProps {
  data: Task[]
  startNumber: number
  onView: (task: Task) => void
  onEdit: (task: Task) => void
  onArchive: (task: Task) => void
  onDelete: (task: Task) => void
}

function ClassCell({ classNames }: { classNames: string[] }) {
  if (classNames.length === 1) return <span>{classNames[0]}</span>
  return (
    <span>
      {classNames[0]}{' '}
      <span className="text-brand-muted">+{classNames.length - 1} lainnya</span>
    </span>
  )
}

function DeadlineCell({ task }: { task: Task }) {
  const remaining = daysUntil(task.deadline)
  const isNear = task.status === 'aktif' && remaining >= 0 && remaining <= 3

  return (
    <div>
      <p className="text-brand-navy">{formatDate(task.deadline)}</p>
      <p className="text-xs text-brand-muted">{formatTime(task.deadline)}</p>
      {isNear && (
        <span className="mt-0.5 inline-block rounded-full bg-status-warning-bg px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-status-warning">
          Mendekati
        </span>
      )}
    </div>
  )
}

export default function TaskManagementTable({
  data,
  startNumber,
  onView,
  onEdit,
  onArchive,
  onDelete,
}: TaskManagementTableProps) {
  return (
    <div className="hidden overflow-x-auto sm:block">
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead>
          <tr className="border-b border-brand-navy/10 text-[11px] font-mono uppercase tracking-wide text-brand-muted">
            <th className="w-10 pb-2 pr-4 font-medium">No</th>
            <th className="pb-2 pr-4 font-medium">Tugas</th>
            <th className="pb-2 pr-4 font-medium">Guru</th>
            <th className="pb-2 pr-4 font-medium">Mata Pelajaran</th>
            <th className="pb-2 pr-4 font-medium">Kelas</th>
            <th className="pb-2 pr-4 font-medium">Deadline</th>
            <th className="pb-2 pr-4 font-medium">Pengumpulan</th>
            <th className="pb-2 pr-4 font-medium">Status</th>
            <th className="pb-2 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-navy/5">
          {data.map((task, idx) => (
            <tr
              key={task.id}
              className="cursor-pointer align-top hover:bg-brand-bg/60"
              onClick={() => onView(task)}
            >
              <td className="py-3 pr-4 text-brand-muted">{startNumber + idx}</td>
              <td className="max-w-[220px] py-3 pr-4">
                <p className="truncate font-semibold text-brand-navy">{task.title}</p>
                <p className="truncate text-xs text-brand-muted">
                  {task.shortDescription}
                </p>
              </td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange-light font-mono text-[10px] font-bold text-brand-orange">
                    {task.teacher.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-brand-navy">{task.teacher}</span>
                </div>
              </td>
              <td className="py-3 pr-4 text-brand-navy">{task.subject}</td>
              <td className="py-3 pr-4 text-brand-navy">
                <ClassCell classNames={task.classNames} />
              </td>
              <td className="py-3 pr-4">
                <DeadlineCell task={task} />
              </td>
              <td className="py-3 pr-4 text-brand-navy">
                {task.submissionSubmitted} / {task.submissionTotal}
              </td>
              <td className="py-3 pr-4">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wide ${taskStatusTone[task.status]}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {taskStatusLabel[task.status]}
                </span>
              </td>
              <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                <RowActionMenu
                  actions={[
                    { label: 'Lihat Detail', icon: Eye, onClick: () => onView(task) },
                    { label: 'Edit', icon: Pencil, onClick: () => onEdit(task) },
                    {
                      label: 'Arsipkan',
                      icon: Archive,
                      onClick: () => onArchive(task),
                    },
                    {
                      label: 'Hapus',
                      icon: Trash2,
                      tone: 'danger',
                      onClick: () => onDelete(task),
                    },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}