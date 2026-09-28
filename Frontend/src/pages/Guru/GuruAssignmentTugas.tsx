import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GuruLayout from '../../layouts/GuruLayout'
import ErrorState from '../../components/admin/ErrorState'
import AssignmentTable from '../../components/Guru/assignment/GuruAssignmentTable'
import AssignmentSummaryCard from '../../components/Guru/assignment/AssignmentSummaryCard'
import SubmissionTimeline from '../../components/Guru/assignment/SubmissionTimeline'
import { getGuruAssignments } from '../../services/guruService'
import type { GuruAssignmentsResponse } from '../../types/Guru/guruAssignmentResponse'

export default function GuruAssignmentsPage() {
    const navigate = useNavigate()
    const [classId, setClassId] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [data, setData] = useState<GuruAssignmentsResponse | null>(null)

    const loadData = useCallback(async () => {
        setIsLoading(true)
        setIsError(false)
        try {
            setData(await getGuruAssignments(classId))
        } catch {
            setIsError(true)
        } finally {
            setIsLoading(false)
        }
    }, [classId])

    useEffect(() => {
        loadData()
    }, [loadData])

    return (
        <GuruLayout>
            <div className="mb-5">
                <h1 className="text-xl font-extrabold text-brand-navy">Materi & Tugas</h1>
                <p className="mt-1 text-sm text-brand-muted">
                    Kelola tugas dan pantau pengumpulan siswa.
                </p>
            </div>

            {isError ? (
                <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
                    <ErrorState
                        title="Gagal memuat data tugas."
                        description="Terjadi masalah saat mengambil data. Silakan coba lagi."
                        onRetry={loadData}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">
                    {/* Kolom kiri */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3 rounded-sm border border-[#EBD3C0] bg-[#FFEFE3] p-4">
                            <label className="flex items-center gap-2 font-mono text-[10px] uppercase text-[#7A6A5C]">
                                Kelas
                                <select
                                    value={classId}
                                    onChange={(e) => setClassId(e.target.value)}
                                    className="rounded-sm border border-[#EBD3C0] bg-white px-3 py-1.5 text-xs normal-case text-[#2B211A]"
                                >
                                    <option value="">Semua Kelas</option>
                                    {data?.classes.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <button
                                type="button"
                                onClick={() => navigate('/teacher/assignments/new')}
                                className="rounded-sm bg-[#FF9500] px-4 py-1.5 font-mono text-[10px] font-bold uppercase text-[#2B211A] hover:bg-[#E68600]"
                            >
                                Tambahkan
                            </button>
                        </div>

                        {isLoading || !data ? (
                            <div className="space-y-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-16 animate-pulse rounded-sm bg-[#FFEFE3]" />
                                ))}
                            </div>
                        ) : (
                            <AssignmentTable
                                assignments={data.assignments}
                                onAction={(a) => navigate(`/teacher/assignments/${a.id}`)}
                            />
                        )}
                    </div>

                    {/* Kolom kanan */}
                    <div className="space-y-5">
                        {isLoading || !data ? (
                            <>
                                <div className="h-40 animate-pulse rounded-sm bg-[#3A2E24]/20" />
                                <div className="h-64 animate-pulse rounded-sm bg-[#FFEFE3]" />
                            </>
                        ) : (
                            <>
                                <AssignmentSummaryCard
                                    ungradedCount={data.summary.ungradedCount}
                                    efficiencyRate={data.summary.efficiencyRate}
                                />
                                <SubmissionTimeline items={data.upcomingDeadlines} />
                            </>
                        )}
                    </div>
                </div>
            )}
        </GuruLayout>
    )
}