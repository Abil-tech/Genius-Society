import { Eye, Pencil, Trash2, CheckCircle2 } from 'lucide-react'
import type { Personnel } from '../../../types/Personnel'

const avatarTone: Record<Personnel['avatarTone'], string> = {
  orange: 'bg-brand-orange-light text-brand-orange',
  red: 'bg-red-50 text-red-500',
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
  pink: 'bg-pink-50 text-pink-500',
}

interface PersonnelTableProps {
  data: Personnel[]
  total: number
}

export default function PersonnelTable({ data, total }: PersonnelTableProps) {
  return (
    <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-brand-navy">
            Daftar Tenaga Pendidik & Kependidikan
          </h3>
          <span className="rounded-full bg-brand-bg px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-brand-muted">
            {total} Terdata
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wide text-brand-muted">
          Filter Aktif:{' '}
          <span className="font-semibold text-brand-orange">Semua Personel</span>
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-brand-navy/10 text-[11px] font-mono uppercase tracking-wide text-brand-muted">
              <th className="pb-2 pr-4 font-medium">NIP</th>
              <th className="pb-2 pr-4 font-medium">Nama Lengkap & Profil</th>
              <th className="pb-2 pr-4 font-medium">Tipe</th>
              <th className="pb-2 pr-4 font-medium">Jabatan / Mapel</th>
              <th className="pb-2 pr-4 font-medium">Status Walas</th>
              <th className="pb-2 pr-4 font-medium">Status</th>
              <th className="pb-2 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-navy/5">
            {data.map((person) => (
              <tr key={person.nip}>
                <td className="py-3 pr-4 font-mono text-[11px] text-brand-muted">
                  {person.nip}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold ${avatarTone[person.avatarTone]}`}
                    >
                      {person.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-brand-navy">
                        {person.name}
                      </p>
                      <p className="truncate text-xs text-brand-muted">
                        {person.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${
                      person.type === 'guru'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-brand-bg text-brand-navy/60'
                    }`}
                  >
                    {person.type}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <p className="text-sm text-brand-navy">{person.role}</p>
                  <p className="text-xs text-brand-muted">{person.assignment}</p>
                </td>
                <td className="py-3 pr-4 text-xs">
                  {person.homeroom.isHomeroom ? (
                    <span className="flex items-center gap-1 font-medium text-status-success">
                      <CheckCircle2 size={12} strokeWidth={2.5} />
                      Ya ({person.homeroom.className})
                    </span>
                  ) : (
                    <span className="text-brand-muted">Tidak (-)</span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wide ${
                      person.status === 'aktif'
                        ? 'bg-status-success-bg text-status-success'
                        : 'bg-status-danger-bg text-status-danger'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {person.status}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center justify-end gap-2 text-brand-muted">
                    <button className="hover:text-brand-navy">
                      <Eye size={15} strokeWidth={2} />
                    </button>
                    <button className="hover:text-brand-orange">
                      <Pencil size={15} strokeWidth={2} />
                    </button>
                    <button className="hover:text-status-danger">
                      <Trash2 size={15} strokeWidth={2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}