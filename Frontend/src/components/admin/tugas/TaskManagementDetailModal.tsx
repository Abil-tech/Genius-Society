import { FileText } from 'lucide-react'
import Modal from '../../admin/Modal'
import type { Task } from '../../../types/task'
import { taskStatusLabel } from '../../../utils/taskManagementContent'
import { formatDate, formatTime } from '../../../utils/dateFormat'

interface TaskManagementDetailModalProps {
  task: Task
  onClose: () => void
  onEdit: () => void
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-brand-muted">{label}</dt>
      <dd className="font-semibold text-brand-navy">{value}</dd>
    </div>
  )
}

export default function TaskManagementDetailModal({
  task,
  onClose,
  onEdit,
}: TaskManagementDetailModalProps) {
  const notSubmitted = task.submissionTotal - task.submissionSubmitted

  return (
    <Modal
      title="Detail Tugas"
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
            Edit Tugas
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <section>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
            Informasi Tugas
          </h3>
          <h4 className="mt-2 text-base font-bold text-brand-navy">{task.title}</h4>
          <p className="mt-1 text-sm text-brand-muted">{task.description}</p>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-3">
            <Field label="Guru" value={task.teacher} />
            <Field label="Mata Pelajaran" value={task.subject} />
            <Field label="Kelas" value={task.classNames.join(', ')} />
            <Field label="Tahun Ajaran" value={task.academicYear} />
            <Field label="Tanggal Dibuat" value={formatDate(task.createdDate)} />
            <Field label="Tanggal Mulai" value={formatDate(task.startDate)} />
            <Field
              label="Deadline"
              value={`${formatDate(task.deadline)}, ${formatTime(task.deadline)}`}
            />
            <Field label="Status" value={taskStatusLabel[task.status]} />
          </dl>
        </section>

        <section>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
            Pengumpulan
          </h3>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-brand-bg p-3 text-center">
              <p className="text-lg font-extrabold text-brand-navy">
                {task.submissionTotal}
              </p>
              <p className="text-[11px] text-brand-muted">Total Siswa</p>
            </div>
            <div className="rounded-lg bg-status-success-bg p-3 text-center">
              <p className="text-lg font-extrabold text-status-success">
                {task.submissionSubmitted}
              </p>
              <p className="text-[11px] text-brand-muted">Sudah Kumpul</p>
            </div>
            <div className="rounded-lg bg-brand-bg p-3 text-center">
              <p className="text-lg font-extrabold text-brand-navy">{notSubmitted}</p>
              <p className="text-[11px] text-brand-muted">Belum Kumpul</p>
            </div>
            <div className="rounded-lg bg-status-danger-bg p-3 text-center">
              <p className="text-lg font-extrabold text-status-danger">
                {task.submissionLate}
              </p>
              <p className="text-[11px] text-brand-muted">Terlambat</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
            Attachment
          </h3>
          {task.attachments.length === 0 ? (
            <p className="mt-2 text-sm text-brand-muted">
              Tidak ada lampiran pada tugas ini.
            </p>
          ) : (
            <div className="mt-2 space-y-1.5">
              {task.attachments.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center gap-2.5 rounded-lg border border-brand-navy/5 px-3 py-2"
                >
                  <FileText size={16} strokeWidth={2} className="text-brand-orange" />
                  <span className="flex-1 truncate text-sm text-brand-navy">
                    {file.name}
                  </span>
                  <span className="font-mono text-[9px] font-bold uppercase text-brand-muted">
                    {file.type}
                  </span>
                  <span className="text-xs text-brand-muted">{file.size}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Modal>
  )
}