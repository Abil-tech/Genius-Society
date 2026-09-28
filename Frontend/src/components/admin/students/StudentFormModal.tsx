import { useState } from 'react'
import Modal from '../../../components/admin/Modal'
import type { Student, StudentFormValues, Gender } from '../../../types/Student'

interface StudentFormModalProps {
  mode: 'add' | 'edit'
  initial?: Student
  existingStudents: Student[]
  classOptions: string[]
  majorOptions: string[]
  academicYearOptions: string[]
  onClose: () => void
  onSubmit: (values: StudentFormValues) => void
  isSubmitting?: boolean
}

const emptyForm: StudentFormValues = {
  name: '',
  nis: '',
  nisn: '',
  nik: '',
  gender: 'L',
  birthPlace: '',
  birthDate: '',
  email: '',
  phone: '',
  address: '',
  className: '',
  major: '',
  grade: 10,
  academicYear: '2026/2027',
  username: '',
  password: '',
  status: 'aktif',
}

type FormErrors = Partial<Record<keyof StudentFormValues, string>>

export default function StudentFormModal({
  mode,
  initial,
  existingStudents,
  classOptions,
  majorOptions,
  academicYearOptions,
  onClose,
  onSubmit,
  isSubmitting = false,
}: StudentFormModalProps) {
  const [values, setValues] = useState<StudentFormValues>(
    initial
      ? {
          name: initial.name,
          nis: initial.nis,
          nisn: initial.nisn,
          nik: initial.nik,
          gender: initial.gender,
          birthPlace: initial.birthPlace,
          birthDate: initial.birthDate,
          email: initial.email,
          phone: initial.phone,
          address: initial.address,
          className: initial.className,
          major: initial.major,
          grade: initial.grade,
          academicYear: initial.academicYear,
          username: initial.username,
          password: '',
          status: initial.status,
        }
      : emptyForm,
  )
  const [errors, setErrors] = useState<FormErrors>({})

  function update<K extends keyof StudentFormValues>(
    key: K,
    value: StudentFormValues[K],
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

    if (!values.nis.trim()) {
      nextErrors.nis = 'NIS wajib diisi.'
    } else if (
      existingStudents.some(
        (s) => s.nis === values.nis.trim() && s.id !== initial?.id,
      )
    ) {
      nextErrors.nis = 'NIS sudah digunakan siswa lain.'
    }

    if (!/^\d{10}$/.test(values.nisn.trim())) {
      nextErrors.nisn = 'NISN harus berupa 10 digit angka.'
    } else if (
      existingStudents.some(
        (s) => s.nisn === values.nisn.trim() && s.id !== initial?.id,
      )
    ) {
      nextErrors.nisn = 'NISN sudah digunakan siswa lain.'
    }

    if (!/^\d{16}$/.test(values.nik.trim())) {
      nextErrors.nik = 'NIK harus berupa 16 digit angka.'
    }

    if (!emailRegex.test(values.email.trim())) {
      nextErrors.email = 'Format email tidak valid.'
    }

    if (!values.className.trim()) {
      nextErrors.className = 'Kelas wajib dipilih.'
    }
    if (!values.major.trim()) {
      nextErrors.major = 'Jurusan wajib dipilih.'
    }
    if (!values.academicYear.trim()) {
      nextErrors.academicYear = 'Tahun ajaran wajib dipilih.'
    }
    if (!values.username.trim()) {
      nextErrors.username = 'Username wajib diisi.'
    }
    if (mode === 'add' && values.password.trim().length < 6) {
      nextErrors.password = 'Password minimal 6 karakter.'
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

  const inputClass = (field: keyof StudentFormValues) =>
    `mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange ${
      errors[field] ? 'border-status-danger' : 'border-brand-navy/10'
    }`

  return (
    <Modal
      title={mode === 'add' ? 'Tambah Siswa' : 'Edit Siswa'}
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
            form="student-form"
            disabled={isSubmitting}
            className="rounded-lg bg-brand-orange px-4 py-2 text-xs font-semibold text-white hover:bg-brand-orange-dark disabled:opacity-60"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </>
      }
    >
      <form id="student-form" onSubmit={handleSubmit} className="space-y-7" noValidate>
        {/* Data Identitas */}
        <section>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
            Data Identitas
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy">
                Nama Lengkap
              </label>
              <input
                value={values.name}
                onChange={(e) => update('name', e.target.value)}
                className={inputClass('name')}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-status-danger">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                NIS
              </label>
              <input
                value={values.nis}
                onChange={(e) => update('nis', e.target.value)}
                placeholder="001245"
                className={inputClass('nis')}
              />
              {errors.nis && (
                <p className="mt-1 text-xs text-status-danger">{errors.nis}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                NISN
              </label>
              <input
                value={values.nisn}
                onChange={(e) => update('nisn', e.target.value)}
                placeholder="10 digit angka"
                maxLength={10}
                className={inputClass('nisn')}
              />
              {errors.nisn && (
                <p className="mt-1 text-xs text-status-danger">{errors.nisn}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                NIK
              </label>
              <input
                value={values.nik}
                onChange={(e) => update('nik', e.target.value)}
                placeholder="16 digit angka"
                maxLength={16}
                className={inputClass('nik')}
              />
              {errors.nik && (
                <p className="mt-1 text-xs text-status-danger">{errors.nik}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                Jenis Kelamin
              </label>
              <select
                value={values.gender}
                onChange={(e) => update('gender', e.target.value as Gender)}
                className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                Tempat Lahir
              </label>
              <input
                value={values.birthPlace}
                onChange={(e) => update('birthPlace', e.target.value)}
                className={inputClass('birthPlace')}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                Tanggal Lahir
              </label>
              <input
                value={values.birthDate}
                onChange={(e) => update('birthDate', e.target.value)}
                placeholder="Contoh: 12 Maret 2009"
                className={inputClass('birthDate')}
              />
            </div>
          </div>
        </section>

        {/* Data Kontak */}
        <section>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
            Data Kontak
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                Email
              </label>
              <input
                type="email"
                value={values.email}
                onChange={(e) => update('email', e.target.value)}
                className={inputClass('email')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-status-danger">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                Nomor Telepon
              </label>
              <input
                value={values.phone}
                onChange={(e) => update('phone', e.target.value)}
                className={inputClass('phone')}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy">
                Alamat
              </label>
              <textarea
                value={values.address}
                onChange={(e) => update('address', e.target.value)}
                rows={2}
                className="mt-1.5 w-full resize-none rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
              />
            </div>
          </div>
        </section>

        {/* Data Akademik */}
        <section>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
            Data Akademik
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                Kelas
              </label>
              <select
                value={values.className}
                onChange={(e) => update('className', e.target.value)}
                className={inputClass('className')}
              >
                <option value="">Pilih kelas...</option>
                {classOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.className && (
                <p className="mt-1 text-xs text-status-danger">
                  {errors.className}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                Jurusan
              </label>
              <select
                value={values.major}
                onChange={(e) => update('major', e.target.value)}
                className={inputClass('major')}
              >
                <option value="">Pilih jurusan...</option>
                {majorOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              {errors.major && (
                <p className="mt-1 text-xs text-status-danger">{errors.major}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                Tingkat
              </label>
              <select
                value={values.grade}
                onChange={(e) => update('grade', Number(e.target.value))}
                className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
              >
                <option value={10}>10</option>
                <option value={11}>11</option>
                <option value={12}>12</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                Tahun Ajaran
              </label>
              <select
                value={values.academicYear}
                onChange={(e) => update('academicYear', e.target.value)}
                className={inputClass('academicYear')}
              >
                {academicYearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              {errors.academicYear && (
                <p className="mt-1 text-xs text-status-danger">
                  {errors.academicYear}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Akun */}
        <section>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
            Akun
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                Username
              </label>
              <input
                value={values.username}
                onChange={(e) => update('username', e.target.value)}
                className={inputClass('username')}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-status-danger">
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                {mode === 'add' ? 'Password' : 'Password Baru (opsional)'}
              </label>
              <input
                type="password"
                value={values.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder={mode === 'edit' ? 'Kosongkan jika tidak diubah' : ''}
                className={inputClass('password')}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-status-danger">
                  {errors.password}
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
                  update('status', e.target.value as StudentFormValues['status'])
                }
                className="mt-1.5 w-full rounded-lg border border-brand-navy/10 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>
        </section>
      </form>
    </Modal>
  )
}