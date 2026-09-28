import { useNavigate } from 'react-router-dom'
import { School, BookOpen, ClipboardCheck, ClipboardList } from 'lucide-react'
import type { GuruSummary } from '../../types/Guru/guruDashboard'

interface GuruSummaryCardsProps {
    summary: GuruSummary
}

export default function GuruSummaryCards({ summary }: GuruSummaryCardsProps) {
    const navigate = useNavigate()

    const cards = [
        {
            label: 'Kelas Saya',
            value: summary.totalClasses,
            icon: School,
            href: '/guru/kelas',
        },
        {
            label: 'Mata Pelajaran',
            value: summary.totalSubjects,
            icon: BookOpen,
            href: '/guru/mapel',
        },
        {
            label: 'Tugas Aktif',
            value: summary.activeTasks,
            icon: ClipboardCheck,
            href: '/guru/tugas',
        },
        {
            label: 'Perlu Dinilai',
            value: summary.pendingGrading,
            icon: ClipboardList,
            href: '/guru/penilaian',
            highlighted: summary.pendingGrading > 0,
        },
    ]

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <button
                    key={card.label}
                    onClick={() => navigate(card.href)}
                    className={`rounded-2xl border bg-white p-5 text-left transition-shadow hover:shadow-md ${card.highlighted ? 'border-brand-orange/40' : 'border-brand-navy/5'
                        }`}
                >
                    <div className="flex items-start justify-between">
                        <p className="text-xs font-medium text-brand-navy/70">{card.label}</p>
                        <card.icon size={20} strokeWidth={1.5} className="text-brand-orange/70" />
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-brand-navy">
                        {card.value}
                    </p>
                </button>
            ))}
        </div>
    )
}