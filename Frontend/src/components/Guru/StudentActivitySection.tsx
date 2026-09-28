import EmptyState from '../../components/admin/EmptyState'
import type { StudentActivity } from '../../types/Guru/guruDashboard'

interface StudentActivitySectionProps {
    activities: StudentActivity[]
}

export default function StudentActivitySection({
    activities,
}: StudentActivitySectionProps) {
    return (
        <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
            <h3 className="text-sm font-bold text-brand-navy">
                Aktivitas Siswa Terbaru
            </h3>

            {activities.length === 0 ? (
                <EmptyState title="Belum ada aktivitas siswa terbaru." />
            ) : (
                <div className="mt-3 divide-y divide-brand-navy/5">
                    {activities.map((act) => (
                        <div key={act.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 font-mono text-[10px] font-bold text-blue-600">
                                {act.studentInitial}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-brand-navy">
                                    <span className="font-semibold">{act.studentName}</span>{' '}
                                    {act.action}
                                </p>
                                <p className="text-[11px] text-brand-muted">
                                    {act.className} • {act.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}