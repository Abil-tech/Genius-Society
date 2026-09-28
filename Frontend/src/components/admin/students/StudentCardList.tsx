import { Eye, Pencil, KeyRound, Ban, CheckCircle2, Trash2 } from 'lucide-react'
import type { Student } from '../../../types/Student'
import RowActionMenu from '../../../components/admin/RowActionMenu'

interface StudentCardListProps {
  data: Student[]
  onView: (student: Student) => void
  onEdit: (student: Student) => void
  onToggleStatus: (student: Student) => void
  onResetPassword: (student: Student) => void
  onDelete: (student: Student) => void
}

export default function StudentCardList({
  data,
  onView,
  onEdit,
  onToggleStatus,
  onResetPassword,
  onDelete,
}: StudentCardListProps) {
  return (
    <div className="space-y-3 sm:hidden">
      {data.map((student) => (
        <div
          key={student.id}
          onClick={() => onView(student)}
          className="rounded-xl border border-brand-navy/10 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange-light font-mono text-xs font-bold text-brand-orange">
                {student.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-bold text-brand-navy">{student.name}</p>
                <p className="font-mono text-[11px] text-brand-muted">
                  NIS {student.nis}
                </p>
              </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <RowActionMenu
                actions={[
                  { label: 'Lihat Detail', icon: Eye, onClick: () => onView(student) },
                  { label: 'Edit', icon: Pencil, onClick: () => onEdit(student) },
                  {
                    label: student.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan',
                    icon: student.status === 'aktif' ? Ban : CheckCircle2,
                    onClick: () => onToggleStatus(student),
                  },
                  {
                    label: 'Reset Password',
                    icon: KeyRound,
                    onClick: () => onResetPassword(student),
                  },
                  {
                    label: 'Hapus',
                    icon: Trash2,
                    tone: 'danger',
                    onClick: () => onDelete(student),
                  },
                ]}
              />
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-xs text-brand-muted">{student.className}</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${
                student.status === 'aktif'
                  ? 'bg-status-success-bg text-status-success'
                  : 'bg-status-danger-bg text-status-danger'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {student.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}