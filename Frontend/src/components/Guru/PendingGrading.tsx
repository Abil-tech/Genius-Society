import { useNavigate } from 'react-router-dom'
import EmptyState from '../../components/admin/EmptyState'
import type { PendingSubmission } from '../../types/Guru/guruDashboard'

interface PendingGradingSectionProps {
    submissions: PendingSubmission[]
}

export default function PendingGradingSection({
    submissions,
}: PendingGradingSectionProps) {
    const navigate = useNavigate()

    return (
        <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-brand-navy">Perlu Dinilai</h3>
                <button
                    onClick={() => navigate('/guru/penilaian')}
                    className="text-xs font-semibold text-brand-orange hover:underline"
                >
                    Lihat Semua Penilaian
                </button>
            </div>

            {submissions.length === 0 ? (
                <EmptyState title="Semua submission sudah diperiksa." />
            ) : (
                <div className="mt-3 divide-y divide-brand-navy/5">
                    {submissions.map((sub) => (
                        <div
                            key={sub.id}
                            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                        >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange-light font-mono text-[11px] font-bold text-brand-orange">
                                {sub.studentInitial}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-brand-navy">
                                    {sub.studentName}
                                </p>
                                <p className="truncate text-xs text-brand-muted">
                                    {sub.itemTitle} • {sub.className}
                                </p>
                                <p className="text-[11px] text-brand-muted">
                                    Dikumpulkan {sub.submittedAt}
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/guru/penilaian')}
                                className="shrink-0 rounded-lg bg-brand-orange px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-orange-dark"
                            >
                                Nilai
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}