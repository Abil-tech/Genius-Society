import { Plus, Trash2 } from 'lucide-react'
import Modal from '../../admin/Modal'
import type { Curriculum } from '../../../types/classcurriculum'

interface CurriculumDetailModalProps {
  curriculum: Curriculum
  onClose: () => void
  onAssignSubject: () => void
  onRemoveSubject: (code: string) => void
}

export default function CurriculumDetailModal({
  curriculum,
  onClose,
  onAssignSubject,
  onRemoveSubject,
}: CurriculumDetailModalProps) {
  return (
    <Modal
      title="Detail Kurikulum"
      onClose={onClose}
      size="lg"
      footer={
        <button
          onClick={onClose}
          className="rounded-lg border border-brand-navy/10 px-4 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-bg"
        >
          Tutup
        </button>
      }
    >
      <div className="space-y-6">
        <section>
          <h3 className="text-base font-bold text-brand-navy">
            {curriculum.name}
          </h3>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-brand-muted">Tahun Ajaran</dt>
              <dd className="font-semibold text-brand-navy">
                {curriculum.academicYear}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-brand-muted">Tingkat</dt>
              <dd className="font-semibold text-brand-navy">{curriculum.grade}</dd>
            </div>
            <div>
              <dt className="text-xs text-brand-muted">Jurusan</dt>
              <dd className="font-semibold text-brand-navy">{curriculum.major}</dd>
            </div>
            <div>
              <dt className="text-xs text-brand-muted">Status</dt>
              <dd>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${
                    curriculum.status === 'aktif'
                      ? 'bg-status-success-bg text-status-success'
                      : 'bg-status-danger-bg text-status-danger'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {curriculum.status}
                </span>
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
              Mata Pelajaran ({curriculum.subjects.length})
            </h3>
            <button
              onClick={onAssignSubject}
              className="flex items-center gap-1 rounded-lg bg-brand-orange-light px-2.5 py-1.5 text-xs font-semibold text-brand-orange hover:bg-brand-orange hover:text-white"
            >
              <Plus size={13} strokeWidth={2.5} />
              Tambah Mapel
            </button>
          </div>

          {curriculum.subjects.length === 0 ? (
            <p className="mt-2 text-sm text-brand-muted">
              Belum ada mata pelajaran yang ditetapkan pada kurikulum ini.
            </p>
          ) : (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-brand-navy/10 text-[10px] font-mono uppercase tracking-wide text-brand-muted">
                    <th className="pb-2 pr-3 font-medium">No</th>
                    <th className="pb-2 pr-3 font-medium">Kode</th>
                    <th className="pb-2 pr-3 font-medium">Mata Pelajaran</th>
                    <th className="pb-2 pr-3 font-medium">Kelompok</th>
                    <th className="pb-2 pr-3 font-medium">Jam Pelajaran</th>
                    <th className="pb-2 pr-3 font-medium">Status</th>
                    <th className="pb-2 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-navy/5">
                  {curriculum.subjects.map((subject, idx) => (
                    <tr key={subject.code}>
                      <td className="py-2 pr-3 text-brand-muted">{idx + 1}</td>
                      <td className="py-2 pr-3 font-mono text-xs font-bold text-brand-navy">
                        {subject.code}
                      </td>
                      <td className="py-2 pr-3 font-medium text-brand-navy">
                        {subject.name}
                      </td>
                      <td className="py-2 pr-3 text-brand-navy">{subject.group}</td>
                      <td className="py-2 pr-3 text-brand-navy">
                        {subject.hoursPerWeek} JP
                      </td>
                      <td className="py-2 pr-3">
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${
                            subject.status === 'aktif'
                              ? 'bg-status-success-bg text-status-success'
                              : 'bg-status-danger-bg text-status-danger'
                          }`}
                        >
                          {subject.status}
                        </span>
                      </td>
                      <td className="py-2 text-right">
                        <button
                          onClick={() => onRemoveSubject(subject.code)}
                          className="text-brand-muted hover:text-status-danger"
                        >
                          <Trash2 size={14} strokeWidth={2} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </Modal>
  )
}