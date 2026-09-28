import { useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import type { HomeroomClass } from '../../types/Guru/guruDashboard'

interface WalasWidgetProps {
    homeroom: HomeroomClass
}

export default function WalasWidget({ homeroom }: WalasWidgetProps) {
    const navigate = useNavigate()

    return (
        <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange-light/40 p-5">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-brand-orange">
                Wali Kelas
            </h3>

            <div className="mt-3 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-orange">
                    <Users size={20} strokeWidth={2} />
                </span>
                <div>
                    <p className="text-lg font-extrabold text-brand-navy">
                        {homeroom.className}
                    </p>
                    <p className="text-xs text-brand-muted">
                        {homeroom.studentCount} Siswa
                    </p>
                </div>
            </div>

            <button
                onClick={() => navigate('/guru/kelas')}
                className="mt-4 w-full rounded-lg border border-brand-orange/30 bg-white py-2 text-xs font-semibold text-brand-orange hover:bg-brand-orange hover:text-white"
            >
                Lihat Kelas
            </button>
        </div>
    )
}