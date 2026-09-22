import { useState } from 'react'
import Modal from '../../admin/Modal'
import type { SchoolClass, SchoolClassFormValues } from '../../../types/classcurriculum'

interface ClassFormModalProps {
  mode: 'add' | 'edit'
  initial?: SchoolClass
  teacherOptions: string[]
  majorOptions: string[]
  academicYearOptions: string[]
  onClose: () => void
  onSubmit: (values: SchoolClassFormValues) => void
  isSubmitting?: boolean
}

const emptyForm: SchoolClassFormValues = {
  name: '',
  grade: 10,
  major: '',
  homeroomTeacher: '',
  academicYear: '2026/2027',
  status: 'aktif',
}

export default function ClassFormModal({
  mode,
  initial,
  teacherOptions,
  majorOptions,
  academicYearOptions,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ClassFormModalProps) {
  const [values, setValues] = useState<SchoolClassFormValues>(
    initial
      ? {
          name: initial.name,
          grade: initial.grade,
          major: initial.major,
          homeroomTeacher: initial.homeroomTeacher,
          academicYear: initial.academicYear,
          status: initial.status,
        }
      : emptyForm,
  )
  const [errors, setErrors] = useState<Partial<Record<keyof SchoolClassFormValues, string>>>({})

  function update<K extends keyof SchoolClassFormValues>(
    key: K,
    value: SchoolClassFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof SchoolClassFormValues, string>> = {}

    if (values.name.trim().length < 2) {
      nextErrors.name = 'Nama kelas wajib diisi, minimal 2 karakter.'
    }
    if (!values.major.trim()) {
      nextErrors.major = 'Jurusan wajib dipilih.'
    }
    if (!values.homeroomTeacher.trim()) {
      nextErrors.homeroomTeacher = 'Wali kelas wajib dipilih.'
    }
    if (!values.academicYear.trim()) {
      nextErrors.academicYear = 'Tahun ajaran wajib diisi.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) {
      onSubmit(values)
    }
  }

  return (
    <Modal
      title={mode === 'add' ? 'Tambah Kelas' : 'Edit Kelas'}
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
            form="class-form"
            disabled={isSubmitting}
            className="rounded-lg bg-brand-orange px-4 py-2 text-xs font-semibold text-white hover:bg-brand-orange-dark disabled:opacity-60"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </>
      }
    >
      <form id="class-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-xs font-semibold text-brand-navy">
            Nama Kelas
          </label>
          <input
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Contoh: 11 PPLG 1"
            className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange ${
              errors.name ? 'border-status-danger' : 'border-brand-navy/10'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-status-danger">{errors.name}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Tingkat
            </label>
            <select
              value={values.grade}
              onChange={(e) =>
                update('grade', Number(e.target.value) as 10 | 11 | 12)
              }
              className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
            >
              <option value={10}>10</option>
              <option value={11}>11</option>
              <option value={12}>12</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Jurusan
            </label>
            <input
              list="major-options"
              value={values.major}
              onChange={(e) => update('major', e.target.value)}
              placeholder="Contoh: PPLG"
              className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange ${
                errors.major ? 'border-status-danger' : 'border-brand-navy/10'
              }`}
            />
            <datalist id="major-options">
              {majorOptions.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            {errors.major && (
              <p className="mt-1 text-xs text-status-danger">{errors.major}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-navy">
            Wali Kelas
          </label>
          <select
            value={values.homeroomTeacher}
            onChange={(e) => update('homeroomTeacher', e.target.value)}
            className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange ${
              errors.homeroomTeacher ? 'border-status-danger' : 'border-brand-navy/10'
            }`}
          >
            <option value="">Pilih wali kelas...</option>
            {teacherOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.homeroomTeacher && (
            <p className="mt-1 text-xs text-status-danger">
              {errors.homeroomTeacher}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Tahun Ajaran
            </label>
            <input
              list="year-options"
              value={values.academicYear}
              onChange={(e) => update('academicYear', e.target.value)}
              placeholder="2026/2027"
              className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange ${
                errors.academicYear ? 'border-status-danger' : 'border-brand-navy/10'
              }`}
            />
            <datalist id="year-options">
              {academicYearOptions.map((y) => (
                <option key={y} value={y} />
              ))}
            </datalist>
            {errors.academicYear && (
              <p className="mt-1 text-xs text-status-danger">
                {errors.academicYear}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Status
            </label>
            <select
              value={values.status}
              onChange={(e) =>
                update('status', e.target.value as SchoolClassFormValues['status'])
              }
              className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  )
}