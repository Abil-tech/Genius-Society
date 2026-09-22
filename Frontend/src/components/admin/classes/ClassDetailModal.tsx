import Modal from '../../admin/Modal'
import type { SchoolClass } from '../../../types/classcurriculum'

interface ClassDetailModalProps {
  item: SchoolClass
  onClose: () => void
  onEdit: () => void
}

const studentStatusTone: Record<string, string> = {
  aktif: 'bg-status-success-bg text-status-success',
  nonaktif: 'bg-status-danger-bg text-status-danger',
  pindah: 'bg-brand-bg text-brand-navy/60',
}

export default function ClassDetailModal({
  item,
  onClose,
  onEdit,
}: ClassDetailModalProps) {
  return (
    <Modal
      title={`Detail Kelas — ${item.name}`}
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
            Edit Kelas
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <section>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
            Informasi Kelas
          </h3>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs text-brand-muted">Nama Kelas</dt>
              <dd className="font-semibold text-brand-navy">{item.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-brand-muted">Tingkat</dt>
              <dd className="font-semibold text-brand-navy">{item.grade}</dd>
            </div>
            <div>
              <dt className="text-xs text-brand-muted">Jurusan</dt>
              <dd className="font-semibold text-brand-navy">{item.major}</dd>
            </div>
            <div>
              <dt className="text-xs text-brand-muted">Tahun Ajaran</dt>
              <dd className="font-semibold text-brand-navy">{item.academicYear}</dd>
            </div>
            <div>
              <dt className="text-xs text-brand-muted">Wali Kelas</dt>
              <dd className="font-semibold text-brand-navy">
                {item.homeroomTeacher}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-brand-muted">Jumlah Siswa</dt>
              <dd className="font-semibold text-brand-navy">
                {item.students.length} Siswa
              </dd>
            </div>
            <div>
              <dt className="text-xs text-brand-muted">Status</dt>
              <dd>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${
                    item.status === 'aktif'
                      ? 'bg-status-success-bg text-status-success'
                      : 'bg-status-danger-bg text-status-danger'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {item.status}
                </span>
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
            Daftar Siswa
          </h3>
          {item.students.length === 0 ? (
            <p className="mt-2 text-sm text-brand-muted">
              Belum ada siswa terdaftar di kelas ini.
            </p>
          ) : (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-brand-navy/10 text-[10px] font-mono uppercase tracking-wide text-brand-muted">
                    <th className="pb-2 pr-3 font-medium">Nama</th>
                    <th className="pb-2 pr-3 font-medium">NIS</th>
                    <th className="pb-2 pr-3 font-medium">NISN</th>
                    <th className="pb-2 pr-3 font-medium">JK</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-navy/5">
                  {item.students.map((s) => (
                    <tr key={s.nis}>
                      <td className="py-2 pr-3 font-medium text-brand-navy">
                        {s.name}
                      </td>
                      <td className="py-2 pr-3 font-mono text-xs text-brand-muted">
                        {s.nis}
                      </td>
                      <td className="py-2 pr-3 font-mono text-xs text-brand-muted">
                        {s.nisn}
                      </td>
                      <td className="py-2 pr-3 text-brand-navy">{s.gender}</td>
                      <td className="py-2">
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${studentStatusTone[s.status]}`}
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
            Mata Pelajaran
          </h3>
          {item.subjects.length === 0 ? (
            <p className="mt-2 text-sm text-brand-muted">
              Belum ada mata pelajaran yang diampu di kelas ini.
            </p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.subjects.map((subject) => (
                <span
                  key={subject}
                  className="rounded-full bg-brand-bg px-2.5 py-1 text-xs font-medium text-brand-navy"
                >
                  {subject}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>
    </Modal>
  )
}