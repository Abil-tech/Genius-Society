import { CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { GuruUpcomingDeadline } from '../../../types/Guru/guruAssignmentResponse'

const MONTHS = ['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP','OKT','NOV','DES']

function formatDeadline(iso: string) {
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')} | ${hh}:${mm}`
}

interface Props {
  items: GuruUpcomingDeadline[]
  seeAllTo?: string
}

export default function SubmissionTimeline({ items, seeAllTo = '/teacher/schedule' }: Props) {
  return (
    <div className="rounded-sm border border-[#EBD3C0] bg-[#FFEFE3] p-4 font-mono">
      <div className="flex items-center justify-between border-b border-[#EBD3C0] pb-2">
        <h3 className="text-xs font-bold text-[#2B211A]">Jadwal Pengumpulan</h3>
        <CalendarDays className="h-3.5 w-3.5 text-[#7A6A5C]" />
      </div>

      {items.length === 0 ? (
        <p className="py-6 text-center text-xs text-[#7A6A5C]">Tidak ada jadwal terdekat.</p>
      ) : (
        <ol className="mt-4 space-y-5">
          {items.map((item, i) => (
            <li key={item.id} className="relative flex gap-3">
              <span
                className={`mt-1 h-2 w-2 shrink-0 rounded-full border ${
                  i === 0 ? 'border-[#8B4E00] bg-[#FF9500]' : 'border-[#CFC3B8] bg-white'
                }`}
              />
              <div>
                <p className="text-[10px] uppercase text-[#7A6A5C]">{formatDeadline(item.dueAt)}</p>
                <p className="text-xs font-bold text-[#2B211A]">{item.title}</p>
                <p className="text-[9px] uppercase text-[#9A8B7E]">Class: {item.className}</p>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-5 text-center">
        <Link to={seeAllTo} className="text-[11px] text-[#8B4E00] hover:underline">
          Lihat Selengkapnya
        </Link>
      </div>
    </div>
  )
}