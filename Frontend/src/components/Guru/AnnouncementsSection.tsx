import { useNavigate } from 'react-router-dom'
import EmptyState from '../../components/admin/EmptyState'
import type { GuruAnnouncement } from '../../types/Guru/guruDashboard'

interface AnnouncementsSectionProps {
    announcements: GuruAnnouncement[]
}

export default function AnnouncementsSection({
    announcements,
}: AnnouncementsSectionProps) {
    const navigate = useNavigate()

    return (
        <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-brand-navy">Pengumuman</h3>
                <button
                    onClick={() => navigate('/guru/pengumuman')}
                    className="text-xs font-semibold text-brand-orange hover:underline"
                >
                    Lihat Semua Pengumuman
                </button>
            </div>

            {announcements.length === 0 ? (
                <EmptyState title="Belum ada pengumuman." />
            ) : (
                <div className="mt-3 divide-y divide-brand-navy/5">
                    {announcements.map((a) => (
                        <div key={a.id} className="flex items-start gap-2.5 py-3 first:pt-0 last:pb-0">
                            {!a.isRead && (
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                            )}
                            <div className={`min-w-0 flex-1 ${a.isRead ? 'pl-3.5' : ''}`}>
                                <p className="text-sm font-semibold text-brand-navy">{a.title}</p>
                                <p className="mt-0.5 text-xs text-brand-muted">{a.summary}</p>
                                <p className="mt-1 text-[11px] text-brand-navy/40">{a.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}