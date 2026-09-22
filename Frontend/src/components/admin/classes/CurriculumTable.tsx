import { Eye } from 'lucide-react'
import type { Curriculum } from '../../../types/classcurriculum'

interface CurriculumTableProps {
  data: Curriculum[]
  startNumber: number
  onView: (item: Curriculum) => void
}

export default function CurriculumTable({
  data,
  startNumber,
  onView,
}: CurriculumTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-brand-navy/10 text-[11px] font-mono uppercase tracking-wide text-brand-muted">
            <th className="w-10 pb-2 pr-4 font-medium">No</th>
            <th className="pb-2 pr-4 font-medium">Kurikulum</th>
            <th className="pb-2 pr-4 font-medium">Tahun Ajaran</th>
            <th className="pb-2 pr-4 font-medium">Tingkat</th>
            <th className="pb-2 pr-4 font-medium">Jurusan</th>
            <th className="pb-2 pr-4 font-medium">Jumlah Mapel</th>
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
              <td className="py-3 pr-4 text-brand-navy">{item.academicYear}</td>
              <td className="py-3 pr-4 text-brand-navy">{item.grade}</td>
              <td className="py-3 pr-4 text-brand-navy">{item.major}</td>
              <td className="py-3 pr-4 text-brand-navy">
                {item.subjects.length} Mapel
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
              <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onView(item)}
                  className="text-brand-muted hover:text-brand-navy"
                >
                  <Eye size={15} strokeWidth={2} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}