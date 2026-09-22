import { useState } from 'react'
import Modal from '../../../components/admin/Modal'
import type { Subject, SubjectFormValues, SubjectGroup } from '../../../types/subject'

interface SubjectFormModalProps {
  mode: 'add' | 'edit'
  initial?: Subject
  onClose: () => void
  onSubmit: (values: SubjectFormValues) => void
  isSubmitting?: boolean
}

const emptyForm: SubjectFormValues = {
  name: '',
  code: '',
  group: 'umum',
  grades: [],
  description: '',
  status: 'aktif',
}

export default function SubjectFormModal({
  mode,
  initial,
  onClose,
  onSubmit,
  isSubmitting = false,
}: SubjectFormModalProps) {
  const [values, setValues] = useState<SubjectFormValues>(
    initial
      ? {
          name: initial.name,
          code: initial.code,
          group: initial.group,
          grades: initial.grades,
          description: initial.description,
          status: initial.status,
        }
      : emptyForm,
  )

  function update<K extends keyof SubjectFormValues>(
    key: K,
    value: SubjectFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function toggleGrade(grade: number) {
    setValues((prev) => ({
      ...prev,
      grades: prev.grades.includes(grade)
        ? prev.grades.filter((g) => g !== grade)
        : [...prev.grades, grade].sort(),
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <Modal
      title={mode === 'add' ? 'Tambah Mata Pelajaran' : 'Edit Mata Pelajaran'}
      onClose={onClose}
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
            form="subject-form"
            disabled={isSubmitting}
            className="rounded-lg bg-brand-orange px-4 py-2 text-xs font-semibold text-white hover:bg-brand-orange-dark disabled:opacity-60"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </>
      }
    >
      <form id="subject-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-brand-navy">
            Nama Mata Pelajaran
          </label>
          <input
            required
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Contoh: Informatika"
            className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-navy">
            Kode Mata Pelajaran
          </label>
          <input
            required
            value={values.code}
            onChange={(e) => update('code', e.target.value.toUpperCase())}
            placeholder="Contoh: INF"
            maxLength={6}
            className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm font-mono uppercase text-brand-navy outline-none focus:border-brand-orange"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Kelompok
            </label>
            <select
              value={values.group}
              onChange={(e) => update('group', e.target.value as SubjectGroup)}
              className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
            >
              <option value="umum">Umum</option>
              <option value="kejuruan">Kejuruan</option>
              <option value="muatan_lokal">Muatan Lokal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Status
            </label>
            <select
              value={values.status}
              onChange={(e) =>
                update('status', e.target.value as SubjectFormValues['status'])
              }
              className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-navy">
            Tingkat
          </label>
          <div className="mt-1.5 flex gap-2">
            {[10, 11, 12].map((grade) => (
              <button
                type="button"
                key={grade}
                onClick={() => toggleGrade(grade)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                  values.grades.includes(grade)
                    ? 'border-brand-orange bg-brand-orange-light text-brand-orange'
                    : 'border-brand-navy/10 text-brand-muted hover:bg-brand-bg'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-navy">
            Deskripsi
          </label>
          <textarea
            value={values.description}
            onChange={(e) => update('description', e.target.value)}
            rows={3}
            placeholder="Jelaskan cakupan mata pelajaran ini..."
            className="mt-1.5 w-full resize-none rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
          />
        </div>
      </form>
    </Modal>
  )
}