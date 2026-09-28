import { useState } from 'react'
import Modal from '../../../components/admin/Modal'
import type { Task, TaskEditValues, TaskStatus } from '../../../types/task'

interface TaskEditModalProps {
  task: Task
  teacherOptions: string[]
  subjectOptions: string[]
  classOptions: string[]
  onClose: () => void
  onSubmit: (values: TaskEditValues) => void
  isSubmitting?: boolean
}

function toDateTimeLocal(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function TaskEditModal({
  task,
  teacherOptions,
  subjectOptions,
  classOptions,
  onClose,
  onSubmit,
  isSubmitting = false,
}: TaskEditModalProps) {
  const [values, setValues] = useState<TaskEditValues>({
    title: task.title,
    description: task.description,
    teacher: task.teacher,
    subject: task.subject,
    classNames: task.classNames,
    startDate: toDateTimeLocal(task.startDate),
    deadline: toDateTimeLocal(task.deadline),
    status: task.status,
  })
  const [error, setError] = useState<string | null>(null)

  function update<K extends keyof TaskEditValues>(key: K, value: TaskEditValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function toggleClass(className: string) {
    setValues((prev) => ({
      ...prev,
      classNames: prev.classNames.includes(className)
        ? prev.classNames.filter((c) => c !== className)
        : [...prev.classNames, className],
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (values.title.trim().length < 3) {
      setError('Judul tugas wajib diisi, minimal 3 karakter.')
      return
    }
    if (values.classNames.length === 0) {
      setError('Pilih minimal satu kelas.')
      return
    }
    if (new Date(values.deadline) <= new Date(values.startDate)) {
      setError('Deadline harus setelah tanggal mulai.')
      return
    }
    setError(null)
    onSubmit(values)
  }

  return (
    <Modal
      title="Edit Tugas"
      onClose={onClose}
      size="lg"
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
            form="task-edit-form"
            disabled={isSubmitting}
            className="rounded-lg bg-brand-orange px-4 py-2 text-xs font-semibold text-white hover:bg-brand-orange-dark disabled:opacity-60"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </>
      }
    >
      <form id="task-edit-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <p className="rounded-lg bg-status-danger-bg px-3 py-2 text-xs text-status-danger">
            {error}
          </p>
        )}

        <div>
          <label className="block text-xs font-semibold text-brand-navy">Judul</label>
          <input
            value={values.title}
            onChange={(e) => update('title', e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-navy">
            Deskripsi
          </label>
          <textarea
            value={values.description}
            onChange={(e) => update('description', e.target.value)}
            rows={3}
            className="mt-1.5 w-full resize-none rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-navy">Guru</label>
            <select
              value={values.teacher}
              onChange={(e) => update('teacher', e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
            >
              {teacherOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Mata Pelajaran
            </label>
            <select
              value={values.subject}
              onChange={(e) => update('subject', e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
            >
              {subjectOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-navy">Kelas</label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {classOptions.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => toggleClass(c)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  values.classNames.includes(c)
                    ? 'border-brand-orange bg-brand-orange-light text-brand-orange'
                    : 'border-brand-navy/10 text-brand-muted hover:bg-brand-bg'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Tanggal Mulai
            </label>
            <input
              type="datetime-local"
              value={values.startDate}
              onChange={(e) => update('startDate', e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Deadline
            </label>
            <input
              type="datetime-local"
              value={values.deadline}
              onChange={(e) => update('deadline', e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-navy">Status</label>
          <select
            value={values.status}
            onChange={(e) => update('status', e.target.value as TaskStatus)}
            className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
          >
            <option value="draft">Draft</option>
            <option value="aktif">Aktif</option>
            <option value="selesai">Selesai</option>
            <option value="terlambat">Terlambat</option>
            <option value="diarsipkan">Diarsipkan</option>
          </select>
        </div>

        <div className="rounded-lg bg-brand-bg px-3 py-2.5 text-xs text-brand-muted">
          Lampiran dikelola oleh guru pembuat tugas dan tidak dapat diubah dari sini.
        </div>
      </form>
    </Modal>
  )
}