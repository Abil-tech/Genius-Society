import { useNavigate } from 'react-router-dom'
import { ClipboardCheck, FlaskConical, FileText, ClipboardList, School } from 'lucide-react'

const actions = [
  { icon: ClipboardCheck, label: 'Buat Tugas', href: '/guru/tugas' },
  { icon: FlaskConical, label: 'Buat Assessment', href: '/guru/assessment' },
  { icon: FileText, label: 'Tambah Materi', href: '/guru/materi' },
  { icon: ClipboardList, label: 'Lihat Penilaian', href: '/guru/penilaian' },
  { icon: School, label: 'Lihat Kelas', href: '/guru/kelas' },
]

export default function QuickActionsSection() {
  const navigate = useNavigate()

  return (
    <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
      <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-brand-muted">
        Quick Actions
      </h3>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.href)}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-brand-navy/10 bg-white py-3 text-brand-navy transition-colors hover:border-brand-orange hover:bg-brand-orange-light"
          >
            <action.icon size={17} strokeWidth={2} className="text-brand-orange" />
            <span className="text-center text-[11px] font-semibold leading-tight">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}