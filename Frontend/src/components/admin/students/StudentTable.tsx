import { Eye, Pencil, KeyRound, Ban, CheckCircle2, Trash2 } from 'lucide-react'
import type { Student } from '../../../types/Student'
import RowActionMenu from '../../../components/admin/RowActionMenu'

interface StudentTableProps {
  data: Student[]
  startNumber: number
  onView: (student: Student) => void
  onEdit: (student: Student) => void
  onToggleStatus: (student: Student) => void
  onResetPassword: (student: Student) => void
  onDelete: (student: Student) => void
}

export default function StudentTable({
  data,
  startNumber,
  onView,
  onEdit,
  onToggleStatus,
  onResetPassword,
  onDelete,
}: StudentTableProps) {
  return (
    <div className="hidden overflow-x-auto sm:block">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead>
          <tr className="border-b border-brand-navy/10 text-[11px] font-mono uppercase tracking-wide text-brand-muted">
            <th className="w-10 pb-2 pr-4 font-medium">No</th>
            <th className="pb-2 pr-4 font-medium">Siswa</th>
            <th className="pb-2 pr-4 font-medium">NIS</th>
            <th className="pb-2 pr-4 font-medium">NISN</th>
            <th className="pb-2 pr-4 font-medium">Kelas</th>
            <th className="pb-2 pr-4 font-medium">Jenis Kelamin</th>
            <th className="pb-2 pr-4 font-medium">Status</th>
            <th className="pb-2 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-navy/5">
          {data.map((student, idx) => (
            <tr
              key={student.id}
              className="cursor-pointer hover:bg-brand-bg/60"
              onClick={() => onView(student)}
            >
              <td className="py-3 pr-4 text-brand-muted">
                {startNumber + idx}
              </td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange-light font-mono text-[11px] font-bold text-brand-orange">
                    {student.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-brand-navy">
                      {student.name}
                    </p>
                    <p className="truncate text-xs text-brand-muted">
                      {student.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3 pr-4 font-mono text-xs text-brand-navy">
                {student.nis}
              </td>
              <td className="py-3 pr-4 font-mono text-xs text-brand-navy">
                {student.nisn}
              </td>
              <td className="py-3 pr-4 text-brand-navy">{student.className}</td>
              <td className="py-3 pr-4 text-brand-navy">
                {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
              </td>
              <td className="py-3 pr-4">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wide ${
                    student.status === 'aktif'
                      ? 'bg-status-success-bg text-status-success'
                      : 'bg-status-danger-bg text-status-danger'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {student.status}
                </span>
              </td>
              <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}