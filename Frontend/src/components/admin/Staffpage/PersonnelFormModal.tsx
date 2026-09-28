import { useState } from 'react'
import Modal from '../Modal'
import type { Personnel, PersonnelType, PersonnelStatus } from '../../../types/Personnel'
import type { CreatePersonnelPayload, UpdatePersonnelPayload } from '../../../services/personnelService'

export interface PersonnelFormValues {
  name: string
  email: string
  type: PersonnelType
  role: string
  nip: string
  status: PersonnelStatus
  assignment: string
  isHomeroom: boolean
  homeroomClass: string
}

interface PersonnelFormModalProps {
  mode: 'add' | 'edit'
  initial?: Personnel
  onClose: () => void
  onSubmit: (values: PersonnelFormValues) => void
  isSubmitting?: boolean
}

const emptyForm: PersonnelFormValues = {
  name: '',
  email: '',
  type: 'guru',
  role: 'Guru Mata Pelajaran',
  nip: '',
  status: 'aktif',
  assignment: '',
  isHomeroom: false,
  homeroomClass: '',
}

type FormErrors = Partial<Record<keyof PersonnelFormValues, string>>

export default function PersonnelFormModal({
  mode,
  initial,
  onClose,
  onSubmit,
  isSubmitting = false,
}: PersonnelFormModalProps) {
  const [values, setValues] = useState<PersonnelFormValues>(
    initial
      ? {
          name: initial.name,
          email: initial.email,
          type: initial.type,
          role: initial.role,
          nip: initial.nip,
          status: initial.status,
          assignment: initial.assignment,
          isHomeroom: initial.homeroom.isHomeroom,
          homeroomClass: initial.homeroom.className || '',
        }
      : emptyForm,
  )
  const [errors, setErrors] = useState<FormErrors>({})

  function update<K extends keyof PersonnelFormValues>(
    key: K,
    value: PersonnelFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (values.name.trim().length < 2) {
      nextErrors.name = 'Nama lengkap wajib diisi, minimal 2 karakter.'
    }
    if (!emailRegex.test(values.email.trim())) {
      nextErrors.email = 'Format email tidak valid.'
    }
    if (values.isHomeroom && !values.homeroomClass.trim()) {
      nextErrors.homeroomClass = 'Nama kelas walas wajib diisi.'
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

  const inputClass = (field: keyof PersonnelFormValues) =>
    `mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange ${
      errors[field] ? 'border-status-danger' : 'border-brand-navy/10'
    }`

  return (
    <Modal
      title={mode === 'add' ? 'Tambah Guru / Staf' : 'Edit Guru / Staf'}
      onClose={onClose}
      size="md"
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
            form="personnel-form"
            disabled={isSubmitting}
            className="rounded-lg bg-brand-orange px-4 py-2 text-xs font-semibold text-white hover:bg-brand-orange-dark disabled:opacity-60"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </>
      }
    >
      <form id="personnel-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-xs font-semibold text-brand-navy">
            Nama Lengkap
          </label>
          <input
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Ahmad Fauzan, S.Kom."
            className={inputClass('name')}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-status-danger">{errors.name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Email
            </label>
            <input
              type="email"
              value={values.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="nama@genius.sch.id"
              className={inputClass('email')}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-status-danger">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              NIP (opsional)
            </label>
            <input
              value={values.nip}
              onChange={(e) => update('nip', e.target.value)}
              placeholder="198905122015012002"
              className={inputClass('nip')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Tipe Personel
            </label>
            <select
              value={values.type}
              onChange={(e) => update('type', e.target.value as PersonnelType)}
              className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
            >
              <option value="guru">Guru</option>
              <option value="staf">Staf</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Status Akun
            </label>
            <select
              value={values.status}
              onChange={(e) => update('status', e.target.value as PersonnelStatus)}
              className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Jabatan / Role
            </label>
            <input
              value={values.role}
              onChange={(e) => update('role', e.target.value)}
              placeholder="Guru Mata Pelajaran / Staf TU"
              className={inputClass('role')}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Mata Pelajaran / Penugasan
            </label>
            <input
              value={values.assignment}
              onChange={(e) => update('assignment', e.target.value)}
              placeholder="Informatika / Administrasi"
              className={inputClass('assignment')}
            />
          </div>
        </div>

        {values.type === 'guru' && (
          <div className="rounded-xl border border-brand-navy/10 bg-brand-bg/50 p-3.5 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isHomeroom"
                checked={values.isHomeroom}
                onChange={(e) => update('isHomeroom', e.target.checked)}
                className="h-4 w-4 rounded border-brand-navy/20 text-brand-orange focus:ring-brand-orange"
              />
              <label htmlFor="isHomeroom" className="text-xs font-semibold text-brand-navy cursor-pointer">
                Bertindak sebagai Wali Kelas (Walas)
              </label>
            </div>

            {values.isHomeroom && (
              <div>
                <label className="block text-xs font-semibold text-brand-navy">
                  Kelas Walas
                </label>
                <input
                  value={values.homeroomClass}
                  onChange={(e) => update('homeroomClass', e.target.value)}
                  placeholder="Contoh: 11 PPLG 1"
                  className={inputClass('homeroomClass')}
                />
                {errors.homeroomClass && (
                  <p className="mt-1 text-xs text-status-danger">{errors.homeroomClass}</p>
                )}
              </div>
            )}
          </div>
        )}
      </form>
    </Modal>
  )
}
