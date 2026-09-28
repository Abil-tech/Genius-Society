import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import EmptyState from '../../components/admin/EmptyState'
import type { TodaySchedule } from '../../types/Guru/guruDashboard'

const statusTone: Record<TodaySchedule['status'], string> = {
    akan_datang: 'bg-brand-bg text-brand-navy/60',
    berlangsung: 'bg-status-success-bg text-status-success',
    selesai: 'bg-blue-50 text-blue-600',
}

const statusLabel: Record<TodaySchedule['status'], string> = {
    akan_datang: 'Akan Datang',
    berlangsung: 'Sedang Berlangsung',
    selesai: 'Selesai',
}

interface TodayScheduleSectionProps {
    schedules: TodaySchedule[]
}

export default function TodayScheduleSection({ schedules }: TodayScheduleSectionProps) {
    const navigate = useNavigate()

    return (
        <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-brand-navy">
                    Jadwal Mengajar Hari Ini
                </h3>
                <button
                    onClick={() => navigate('/guru/jadwal')}
                    className="text-xs font-semibold text-brand-orange hover:underline"
                >
                    Lihat Semua Jadwal
                </button>
            </div>

            {schedules.length === 0 ? (
                <EmptyState title="Tidak ada jadwal mengajar hari ini." />
            ) : (
                <div className="mt-3 divide-y divide-brand-navy/5">
                    {schedules.map((s) => (
                        <div key={s.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                            <div className="w-16 shrink-0 text-center">
                                <p className="text-sm font-bold text-brand-navy">{s.startTime}</p>
                                <p className="text-[10px] text-brand-muted">{s.endTime}</p>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-brand-navy">{s.subject}</p>
                                <p className="flex items-center gap-1 text-xs text-brand-muted">
                                    {s.className}
                                    {s.room && (
                                        <>
                                            <span className="text-brand-navy/20">•</span>
                                            <MapPin size={11} strokeWidth={2} />
                                            {s.room}
                                        </>
                                    )}
                                </p>
                            </div>
                            <span
                                className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wide ${statusTone[s.status]}`}
                            >
                                {statusLabel[s.status]}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}