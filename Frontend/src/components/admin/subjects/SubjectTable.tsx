import { Eye, Pencil, Trash2 } from 'lucide-react'
import type { Subject } from '../../../types/subject'
import { groupLabel } from '../../../utils/subject'

const groupBadgeTone: Record<string, string> = {
  umum: 'bg-blue-50 text-blue-600',
  kejuruan: 'bg-brand-orange-light text-brand-orange',
  muatan_lokal: 'bg-purple-50 text-purple-600',
}

interface SubjectTableProps {
  data: Subject[]
  startNumber: number
  onView: (subject: Subject) => void
  onEdit: (subject: Subject) => void
  onDelete: (subject: Subject) => void
}

export default function SubjectTable({
  data,
  startNumber,
  onView,
  onEdit,
  onDelete,
}: SubjectTableProps) {
  return (
    <div className="hidden overflow-x-auto sm:block">
      <table className="w-full min-w-[780px] text-left text-sm">
        <thead>
          <tr className="border-b border-brand-navy/10 text-[11px] font-mono uppercase tracking-wide text-brand-muted">
            <th className="w-10 pb-2 pr-4 font-medium">No</th>
            <th className="pb-2 pr-4 font-medium">Kode</th>
            <th className="pb-2 pr-4 font-medium">Mata Pelajaran</th>
            <th className="pb-2 pr-4 font-medium">Kelompok</th>
            <th className="pb-2 pr-4 font-medium">Tingkat</th>
            <th className="pb-2 pr-4 font-medium">Jumlah Guru</th>
            <th className="pb-2 pr-4 font-medium">Jumlah Kelas</th>
            <th className="pb-2 pr-4 font-medium">Status</th>
            <th className="pb-2 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-navy/5">
          {data.map((subject, idx) => (
            <tr
              key={subject.id}
              className="cursor-pointer hover:bg-brand-bg/60"
              onClick={() => onView(subject)}
            >
              <td className="py-3 pr-4 text-brand-muted">
                {startNumber + idx}
              </td>
              <td className="py-3 pr-4 font-mono text-xs font-bold text-brand-navy">
                {subject.code}
              </td>
              <td className="py-3 pr-4 font-semibold text-brand-navy">
                {subject.name}
              </td>
              <td className="py-3 pr-4">
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${groupBadgeTone[subject.group]}`}
                >
                  {groupLabel[subject.group]}
                </span>
              </td>
              <td className="py-3 pr-4 text-brand-navy">
                {subject.grades.length > 1
                  ? `${subject.grades[0]}–${subject.grades[subject.grades.length - 1]}`
                  : subject.grades[0]}
              </td>
              <td className="py-3 pr-4 text-brand-navy">
                {subject.teachers.length} Guru
              </td>
              <td className="py-3 pr-4 text-brand-navy">
                {subject.classes.length} Kelas
              </td>
              <td className="py-3 pr-4">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wide ${
                    subject.status === 'aktif'
                      ? 'bg-status-success-bg text-status-success'
                      : 'bg-status-danger-bg text-status-danger'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {subject.status}
                </span>
              </td>
              <td className="py-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-2 text-brand-muted">
                  <button
                    onClick={() => onView(subject)}
                    className="hover:text-brand-navy"
                  >
                    <Eye size={15} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => onEdit(subject)}
                    className="hover:text-brand-orange"
                  >
                    <Pencil size={15} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => onDelete(subject)}
                    className="hover:text-status-danger"
                  >
                    <Trash2 size={15} strokeWidth={2} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}