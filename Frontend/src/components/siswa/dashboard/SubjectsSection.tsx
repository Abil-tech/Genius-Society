import { User } from 'lucide-react'
import type { SubjectGrade } from '../../types/student'
import { formatScore } from '../../utils/format'
import { Card } from '../ui/Card'
import { SectionHeading } from '../ui/SectionHeading'
import { StateMessage } from '../ui/StateMessage'

interface Props {
  subjects: SubjectGrade[]
  termLabel: string
  className?: string
}

export function SubjectsSection({ subjects, termLabel, className = '' }: Props) {
  return (
    <section aria-labelledby="sec-subjects" className={`flex min-w-0 flex-col gap-3 ${className}`}>
      <SectionHeading id="sec-subjects" title="Mata Pelajaran" aside={termLabel} />
      {subjects.length === 0 ? (
        <Card>
          <StateMessage
            variant="empty"
            title="Belum ada mata pelajaran"
            description="Kamu belum terdaftar di kelas mana pun pada tahun ajaran ini."
          />
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {subjects.map((s) => (
            <li key={s.id} className="min-w-0">
              <Card className="flex h-full flex-col gap-3 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded border border-line bg-cream-100 px-2 py-0.5 font-mono text-xs">
                    {s.code}
                  </span>
                  <p className="text-right">
                    <span className="sr-only">Nilai akhir </span>
                    <span className="text-2xl font-bold leading-none">{formatScore(s.finalScore)}</span>
                  </p>
                </div>
                <h3 className="flex-1 text-base font-semibold leading-snug [overflow-wrap:anywhere] sm:text-lg">
                  {s.name}
                </h3>
                <div
                  role="progressbar"
                  aria-label={`Nilai akhir ${s.name}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={s.finalScore}
                  className="h-1 w-full overflow-hidden rounded-full bg-cream-200"
                >
                  <div className="h-full bg-brand" style={{ width: `${Math.min(100, Math.max(0, s.finalScore))}%` }} />
                </div>
                <p className="flex items-center gap-1.5 border-t border-line pt-3 text-sm text-ink-soft">
                  <User aria-hidden className="size-4 shrink-0" />
                  <span className="min-w-0 [overflow-wrap:anywhere]">{s.teacherName}</span>
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
