import { useState } from 'react'
import Modal from '../../admin/Modal'
import { subjectList } from '../../../utils/subject'
import { groupLabel } from '../../../utils/subject'
import type { CurriculumSubject } from '../../../types/classcurriculum'

interface AssignSubjectModalProps {
  excludeCodes: string[]
  onClose: () => void
  onAssign: (subject: CurriculumSubject) => void
}

export default function AssignSubjectModal({
  excludeCodes,
  onClose,
  onAssign,
}: AssignSubjectModalProps) {
  const availableSubjects = subjectList.filter(
    (s) => !excludeCodes.includes(s.code),
  )

  const [selectedCode, setSelectedCode] = useState(
    availableSubjects[0]?.code ?? '',
  )
  const [hoursPerWeek, setHoursPerWeek] = useState(4)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const subject = subjectList.find((s) => s.code === selectedCode)

    if (!subject) {
      setError('Pilih mata pelajaran terlebih dahulu.')
      return
    }
    if (hoursPerWeek < 1) {
      setError('Jam pelajaran minimal 1 jam per minggu.')
      return
    }

    onAssign({
      code: subject.code,
      name: subject.name,
      group: groupLabel[subject.group],
      hoursPerWeek,
      status: 'aktif',
    })
  }

  return (
    <Modal
      title="Tambah Mata Pelajaran ke Kurikulum"
      onClose={onClose}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-brand-navy/10 px-4 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-bg"
          >
            Batal
          </button>
          <button
            type="submit"
            form="assign-subject-form"
            className="rounded-lg bg-brand-orange px-4 py-2 text-xs font-semibold text-white hover:bg-brand-orange-dark"
          >
            Tambahkan
          </button>
        </>
      }
    >
      {availableSubjects.length === 0 ? (
        <p className="text-sm text-brand-muted">
          Semua mata pelajaran pada master data sudah ditetapkan di kurikulum
          ini.
        </p>
      ) : (
        <form id="assign-subject-form" onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-lg bg-status-danger-bg px-3 py-2 text-xs text-status-danger">
              {error}
            </p>
          )}

          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Mata Pelajaran
            </label>
            <select
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
            >
              {availableSubjects.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Jam Pelajaran / Minggu
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
            />
          </div>
        </form>
      )}
    </Modal>
  )
}