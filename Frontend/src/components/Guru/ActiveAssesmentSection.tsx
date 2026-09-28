import { useNavigate } from 'react-router-dom'
import EmptyState from '../../components/admin/EmptyState'
import type { GuruActiveAssessment } from '../../types/Guru/guruDashboard'

interface ActiveAssessmentsSectionProps {
  assessments: GuruActiveAssessment[]
}

export default function ActiveAssessmentsSection({
  assessments,
}: ActiveAssessmentsSectionProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-brand-navy">Assessment Aktif</h3>
        <button
          onClick={() => navigate('/guru/assessment')}
          className="text-xs font-semibold text-brand-orange hover:underline"
        >
          Lihat Assessment
        </button>
      </div>

      {assessments.length === 0 ? (
        <EmptyState title="Belum ada assessment aktif." />
      ) : (
        <div className="mt-3 divide-y divide-brand-navy/5">
          {assessments.map((a) => {
            const percentage = Math.round((a.completed / a.totalParticipants) * 100)
            return (
              <div key={a.id} className="py-3 first:pt-0 last:pb-0">
                <p className="text-sm font-semibold text-brand-navy">{a.title}</p>
                <p className="text-xs text-brand-muted">
                  {a.subject} • {a.className}
                </p>
                <p className="mt-0.5 text-[11px] text-brand-muted">
                  Periode: {a.period}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-bg">
                    <div
                      className="h-full rounded-full bg-brand-orange"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-[11px] font-medium text-brand-muted">
                    {a.completed}/{a.totalParticipants} peserta
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}