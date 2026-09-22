import { Eye, Pencil, Trash2 } from 'lucide-react'
import type { SchoolClass } from '../../../types/classcurriculum'

interface ClassTableProps {
  data: SchoolClass[]
  startNumber: number
  onView: (item: SchoolClass) => void
  onEdit: (item: SchoolClass) => void
  onDelete: (item: SchoolClass) => void
}

export default function ClassTable({
  data,
  startNumber,
  onView,
  onEdit,
  onDelete,
}: ClassTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] text-left text-sm">
        <thead>
          <tr className="border-b border-brand-navy/10 text-[11px] font-mono uppercase tracking-wide text-brand-muted">
            <th className="w-10 pb-2 pr-4 font-medium">No</th>
            <th className="pb-2 pr-4 font-medium">Nama Kelas</th>
            <th className="pb-2 pr-4 font-medium">Tingkat</th>
            <th className="pb-2 pr-4 font-medium">Jurusan</th>
            <th className="pb-2 pr-4 font-medium">Wali Kelas</th>
            <th className="pb-2 pr-4 font-medium">Jumlah Siswa</th>
            <th className="pb-2 pr-4 font-medium">Tahun Ajaran</th>
            <th className="pb-2 pr-4 font-medium">Status</th>
            <th className="pb-2 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-navy/5">
          {data.map((item, idx) => (
            <tr
              key={item.id}
              className="cursor-pointer hover:bg-brand-bg/60"
              onClick={() => onView(item)}
            >
              <td className="py-3 pr-4 text-brand-muted">
                {startNumber + idx}
              </td>
              <td className="py-3 pr-4 font-semibold text-brand-navy">
                {item.name}
              </td>
              <td className="py-3 pr-4 text-brand-navy">{item.grade}</td>
              <td className="py-3 pr-4 text-brand-navy">{item.major}</td>
              <td className="py-3 pr-4 text-brand-navy">
                {item.homeroomTeacher}
              </td>
              <td className="py-3 pr-4 text-brand-navy">
                {item.students.length} Siswa
              </td>
              <td className="py-3 pr-4 text-brand-navy">
                {item.academicYear}
              </td>
              <td className="py-3 pr-4">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wide ${
                    item.status === 'aktif'
                      ? 'bg-status-success-bg text-status-success'
                      : 'bg-status-danger-bg text-status-danger'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {item.status}
                </span>
              </td>
              <td className="py-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-2 text-brand-muted">
                  <button onClick={() => onView(item)} className="hover:text-brand-navy">
                    <Eye size={15} strokeWidth={2} />
                  </button>
                  <button onClick={() => onEdit(item)} className="hover:text-brand-orange">
                    <Pencil size={15} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
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