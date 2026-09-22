import Modal from '../../../components/admin/Modal'
import type { Subject } from '../../../types/subject'
import { groupLabel } from '../../../utils/subject'

interface SubjectDetailModalProps {
  subject: Subject
  onClose: () => void
  onEdit: () => void
}

export default function SubjectDetailModal({
  subject,
  onClose,
  onEdit,
}: SubjectDetailModalProps) {
  return (
    <Modal
      title={`Detail Mata Pelajaran — ${subject.code}`}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-brand-navy/10 px-4 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-bg"
          >
            Tutup
          </button>
          <button
            onClick={onEdit}
            className="rounded-lg bg-brand-orange px-4 py-2 text-xs font-semibold text-white hover:bg-brand-orange-dark"
          >
            Edit Mata Pelajaran
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <section>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
            Informasi Mata Pelajaran
          </h3>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs text-brand-muted">Kode</dt>
              <dd className="font-semibold text-brand-navy">{subject.code}</dd>
            </div>
            <div>
              <dt className="text-xs text-brand-muted">Nama</dt>
              <dd className="font-semibold text-brand-navy">{subject.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-brand-muted">Kelompok</dt>
              <dd className="font-semibold text-brand-navy">
                {groupLabel[subject.group]}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-brand-muted">Tingkat</dt>
              <dd className="font-semibold text-brand-navy">
                {subject.grades.join(', ')}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-brand-muted">Status</dt>
              <dd>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${
                    subject.status === 'aktif'
                      ? 'bg-status-success-bg text-status-success'
                      : 'bg-status-danger-bg text-status-danger'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {subject.status}
                </span>
              </dd>
            </div>
          </dl>
          <div className="mt-3">
            <p className="text-xs text-brand-muted">Deskripsi</p>
            <p className="mt-1 text-sm text-brand-navy">{subject.description}</p>
          </div>
        </section>

        <section>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
            Guru Pengajar
          </h3>
          {subject.teachers.length === 0 ? (
            <p className="mt-2 text-sm text-brand-muted">
              Belum ada guru yang ditugaskan.
            </p>
          ) : (
            <div className="mt-2 divide-y divide-brand-navy/5 rounded-lg border border-brand-navy/5">
              {subject.teachers.map((teacher) => (
                <div key={teacher.nip} className="px-3 py-2.5">
                  <p className="text-sm font-semibold text-brand-navy">
                    {teacher.name}
                  </p>
                  <p className="font-mono text-[11px] text-brand-muted">
                    NIP {teacher.nip}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-muted">
                    Kelas: {teacher.classes.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
            Kelas
          </h3>
          {subject.classes.length === 0 ? (
            <p className="mt-2 text-sm text-brand-muted">
              Belum ada kelas yang menggunakan mata pelajaran ini.
            </p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {subject.classes.map((className) => (
                <span
                  key={className}
                  className="rounded-full bg-brand-bg px-2.5 py-1 text-xs font-medium text-brand-navy"
                >
                  {className}
                </span>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
            Kurikulum
          </h3>
          {subject.curriculums.length === 0 ? (
            <p className="mt-2 text-sm text-brand-muted">
              Belum ditetapkan dalam kurikulum manapun.
            </p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-brand-navy">
              {subject.curriculums.map((curriculum) => (
                <li key={curriculum} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                  {curriculum}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Modal>
  )
}