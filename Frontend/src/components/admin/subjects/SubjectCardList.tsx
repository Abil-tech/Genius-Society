import { Eye, Pencil, Trash2 } from 'lucide-react'
import type { Subject } from '../../../types/subject'
import { groupLabel } from '../../../utils/subject'

const groupBadgeTone: Record<string, string> = {
  umum: 'bg-blue-50 text-blue-600',
  kejuruan: 'bg-brand-orange-light text-brand-orange',
  muatan_lokal: 'bg-purple-50 text-purple-600',
}

interface SubjectCardListProps {
  data: Subject[]
  onView: (subject: Subject) => void
  onEdit: (subject: Subject) => void
  onDelete: (subject: Subject) => void
}

export default function SubjectCardList({
  data,
  onView,
  onEdit,
  onDelete,
}: SubjectCardListProps) {
  return (
    <div className="space-y-3 sm:hidden">
      {data.map((subject) => (
        <div
          key={subject.id}
          onClick={() => onView(subject)}
          className="rounded-xl border border-brand-navy/10 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-mono text-[10px] font-bold text-brand-orange">
                {subject.code}
              </p>
              <p className="text-sm font-bold text-brand-navy">
                {subject.name}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${
                subject.status === 'aktif'
                  ? 'bg-status-success-bg text-status-success'
                  : 'bg-status-danger-bg text-status-danger'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {subject.status}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span
              className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${groupBadgeTone[subject.group]}`}
            >
              {groupLabel[subject.group]}
            </span>
            <span className="text-xs text-brand-muted">
              Tingkat{' '}
              {subject.grades.length > 1
                ? `${subject.grades[0]}–${subject.grades[subject.grades.length - 1]}`
                : subject.grades[0]}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-3 text-xs text-brand-muted">
            <span>{subject.teachers.length} Guru</span>
            <span>{subject.classes.length} Kelas</span>
          </div>

          <div
            className="mt-3 flex items-center justify-end gap-3 border-t border-brand-navy/5 pt-2.5 text-brand-muted"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => onView(subject)} className="hover:text-brand-navy">
              <Eye size={15} strokeWidth={2} />
            </button>
            <button onClick={() => onEdit(subject)} className="hover:text-brand-orange">
              <Pencil size={15} strokeWidth={2} />
            </button>
            <button
              onClick={() => onDelete(subject)}
              className="hover:text-status-danger"
            >
              <Trash2 size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}