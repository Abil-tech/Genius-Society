import type { GuruAssignmentItem } from '../../../types/Guru/guruAssignmentResponse'

function formatDate(iso: string) {
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}-${mm}-${d.getFullYear()}`
}

interface Props {
  assignments: GuruAssignmentItem[]
  onAction: (assignment: GuruAssignmentItem) => void
}

export default function AssignmentTable({ assignments, onAction }: Props) {
  if (assignments.length === 0) {
    return (
      <div className="rounded-sm border border-[#EBD3C0] bg-white p-10 text-center font-mono text-sm text-[#7A6A5C]">
        Belum ada tugas untuk kelas ini.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-[#EBD3C0] bg-white shadow-sm">
      <table className="w-full min-w-[640px] font-mono text-xs">
        <thead className="bg-[#FFE8D8] text-left uppercase text-[#7A6A5C]">
          <tr>
            <th className="px-4 py-3 font-normal">Ref_ID</th>
            <th className="px-4 py-3 font-normal">Assignment_Name</th>
            <th className="px-4 py-3 font-normal">Class</th>
            <th className="px-4 py-3 font-normal">Due_Date</th>
            <th className="px-4 py-3 font-normal">Status</th>
            <th className="px-4 py-3 text-right font-normal">Action</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((a) => {
            const complete = a.totalStudents > 0 && a.submittedCount === a.totalStudents
            const percent = a.totalStudents ? (a.submittedCount / a.totalStudents) * 100 : 0
            return (
              <tr
                key={a.id}
                className={`border-t border-[#EBD3C0] ${complete ? 'bg-[#F7F0E8]' : 'bg-white'}`}
              >
                <td className={`px-4 py-4 font-bold ${complete ? 'text-[#8B4E00]' : 'text-[#9A8B7E]'}`}>
                  #{a.refId}
                </td>
                <td className="px-4 py-4 font-bold text-[#2B211A]">{a.name}</td>
                <td className="px-4 py-4 text-[#2B211A]">{a.className}</td>
                <td className={`px-4 py-4 ${complete ? 'text-red-700' : 'text-[#2B211A]'}`}>
                  {formatDate(a.dueDate)}
                </td>
                <td className="px-4 py-4">
                  <p className={complete ? 'text-[#2B211A]' : 'text-[#9A8B7E]'}>
                    {a.submittedCount}/{a.totalStudents}
                    <br />
                    Dikumpulkan
                  </p>
                  <div className="mt-1 h-1 w-24 rounded-full bg-[#FFE0CC]">
                    <div
                      className="h-1 rounded-full bg-[#FF9500]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onAction(a)}
                    className={
                      complete
                        ? 'rounded-sm bg-[#8B4E00] px-4 py-1.5 text-[10px] font-bold uppercase text-white hover:bg-[#6F3E00]'
                        : 'rounded-sm border border-[#CFC3B8] bg-white px-4 py-1.5 text-[10px] font-bold uppercase text-[#2B211A] hover:bg-[#FFF3EA]'
                    }
                  >
                    {complete ? 'Peringkat' : 'Mengumpulkan'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}