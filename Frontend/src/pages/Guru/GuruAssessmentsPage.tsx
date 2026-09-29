import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GuruLayout from '../../layouts/GuruLayout'
import ErrorState from '../../components/admin/ErrorState'
import AssessmentPerformanceSummary from '../../components/Guru/assessment/AssessmentPerformanceSummary'
import AssessmentStatusPanel from '../../components/Guru/assessment/AssessmentStatusPanel'
import AssessmentCard from '../../components/Guru/assessment/AssessmentCard'
import NewAssessmentPlaceholder from '../../components/Guru/assessment/NewAssessmentPlaceholder'
import {
  downloadAssessmentRanking,
  downloadAssessmentReport,
  getGuruAssessments,
} from '../../services/guruService'
import type { GuruAssessmentsResponse } from '../../types/Guru/guruAssessmentsResponse'

export default function GuruAssessmentsPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [data, setData] = useState<GuruAssessmentsResponse | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      setData(await getGuruAssessments())
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const goCreate = () => navigate('/guru/assessment/new')

  async function handleReport() {
    setIsDownloading(true)
    try {
      await downloadAssessmentReport()
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <GuruLayout>
      {isError ? (
        <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
          <ErrorState
            title="Gagal memuat data assessment."
            description="Terjadi masalah saat mengambil data. Silakan coba lagi."
            onRetry={loadData}
          />
        </div>
      ) : isLoading || !data ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">
            <div className="h-48 animate-pulse rounded-md bg-[#FFEFE3]" />
            <div className="h-48 animate-pulse rounded-md bg-[#F7E3D3]" />
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-md bg-[#FFEFE3]" />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">
            <AssessmentPerformanceSummary performance={data.performance} onCreate={goCreate} />
            <AssessmentStatusPanel
              summary={data.statusSummary}
              onDownloadReport={handleReport}
              isDownloading={isDownloading}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {data.assessments.map((item) => (
              <AssessmentCard
                key={item.id}
                item={item}
                onOpen={(a) => navigate(`/teacher/assessments/${a.id}`)}
                onEdit={(a) => navigate(`/teacher/assessments/${a.id}/edit`)}
                onVerify={(a) => navigate(`/teacher/assessments/${a.id}/verify`)}
                onDownloadRanking={(a) => downloadAssessmentRanking(a.id)}
              />
            ))}
            <NewAssessmentPlaceholder onClick={goCreate} />
          </div>
        </div>
      )}
    </GuruLayout>
  )
}