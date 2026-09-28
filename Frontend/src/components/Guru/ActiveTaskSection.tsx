import { useNavigate } from 'react-router-dom'
import EmptyState from '../../components/admin/EmptyState'
import type { GuruActiveTask } from '../../types/Guru/guruDashboard'

const statusTone: Record<GuruActiveTask['status'], string> = {
    aktif: 'bg-status-success-bg text-status-success',
    mendekati_deadline: 'bg-status-warning-bg text-status-warning',
    terlambat: 'bg-status-danger-bg text-status-danger',
    selesai: 'bg-blue-50 text-blue-600',
}

const statusLabel: Record<GuruActiveTask['status'], string> = {
    aktif: 'Aktif',
    mendekati_deadline: 'Mendekati Deadline',
    terlambat: 'Terlambat',
    selesai: 'Selesai',
}

interface ActiveTasksSectionProps {
    tasks: GuruActiveTask[]
}

export default function ActiveTasksSection({ tasks }: ActiveTasksSectionProps) {
    const navigate = useNavigate()

    return (
        <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-brand-navy">Tugas Aktif</h3>
                <button
                    onClick={() => navigate('/guru/tugas')}
                    className="text-xs font-semibold text-brand-orange hover:underline"
                >
                    Lihat Semua Tugas
                </button>
            </div>

            {tasks.length === 0 ? (
                <EmptyState title="Belum ada tugas aktif." />
            ) : (
                <div className="mt-3 divide-y divide-brand-navy/5">
                    {tasks.map((task) => {
                        const percentage = Math.round(
                            (task.submitted / task.totalStudents) * 100,
                        )
                        return (
                            <div key={task.id} className="py-3 first:pt-0 last:pb-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-brand-navy">
                                            {task.title}
                                        </p>
                                        <p className="text-xs text-brand-muted">
                                            {task.subject} • {task.className}
                                        </p>
                                    </div>
                                    <span
                                        className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wide ${statusTone[task.status]}`}
                                    >
                                        {statusLabel[task.status]}
                                    </span>
                                </div>

                                <div className="mt-2 flex items-center gap-2">
                                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-bg">
                                        <div
                                            className="h-full rounded-full bg-brand-orange"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="shrink-0 text-[11px] font-medium text-brand-muted">
                                        {task.submitted}/{task.totalStudents} siswa
                                    </span>
                                </div>
                                <p className="mt-1 text-[11px] text-brand-muted">
                                    Deadline: {task.deadline}
                                </p>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}