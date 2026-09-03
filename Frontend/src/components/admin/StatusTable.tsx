import { statusRows } from '../../utils/dashboardContent'

const barTone: Record<string, string> = {
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  danger: 'bg-status-danger',
}

const badgeTone: Record<string, string> = {
  success: 'bg-status-success-bg text-status-success',
  warning: 'bg-status-warning-bg text-status-warning',
  danger: 'bg-status-danger-bg text-status-danger',
}

export default function StatusTable() {
  const total = statusRows.reduce((sum, row) => sum + row.count, 0)

  return (
    <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-brand-navy">
            Status Tugas & Assessment Keseluruhan
          </h3>
          <p className="text-xs text-brand-muted">
            Rekapitulasi progres pengerjaan dan evaluasi seluruh kelas
          </p>
        </div>
        <span className="rounded-full bg-brand-bg px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-brand-muted">
          Total Pengerjaan: {total}
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-brand-navy/10 text-[11px] font-mono uppercase tracking-wide text-brand-muted">
              <th className="pb-2 font-medium">Kategori Status</th>
              <th className="pb-2 font-medium">Jumlah Item</th>
              <th className="pb-2 font-medium">Persentase</th>
              <th className="pb-2 font-medium">Label Status</th>
              <th className="pb-2 text-right font-medium">Tindakan Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-navy/5">
            {statusRows.map((row) => (
              <tr key={row.category}>
                <td className="py-3 pr-4 text-brand-navy">{row.category}</td>
                <td className="py-3 pr-4 font-semibold text-brand-navy">
                  {row.count}
                </td>
                <td className="py-3 pr-4">
                  <div className="h-1.5 w-28 overflow-hidden rounded-full bg-brand-bg">
                    <div
                      className={`h-full rounded-full ${barTone[row.tone]}`}
                      style={{ width: `${row.percentage}%` }}
                    />
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide ${badgeTone[row.tone]}`}
                  >
                    {row.label}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button className="text-xs font-semibold text-brand-orange hover:underline">
                    {row.action} &rarr;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}