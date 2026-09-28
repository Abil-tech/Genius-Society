import Modal from '../../../components/admin/Modal'
import type { Student } from '../../../types/Student'

interface StudentDetailModalProps {
  student: Student
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

export default function StudentDetailModal({
  student,
  onClose,
  onEdit,
}: StudentDetailModalProps) {
  return (
    <Modal
      title="Detail Siswa"
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
            Edit Siswa
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <section className="flex items-center gap-3">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-orange-light font-mono text-xl font-bold text-brand-orange">
            {student.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-base font-bold text-brand-navy">{student.name}</p>
            <p className="font-mono text-xs text-brand-muted">
              NIS {student.nis} • NISN {student.nisn}
            </p>
            <span
              className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${
                student.status === 'aktif'
                  ? 'bg-status-success-bg text-status-success'
                  : 'bg-status-danger-bg text-status-danger'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {student.status}
            </span>
          </div>
        </section>

        <section>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
            Data Pribadi
          </h3>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-3">
            <Field label="Nama Lengkap" value={student.name} />
            <Field label="NIK" value={student.nik} />
            <Field
              label="Jenis Kelamin"
              value={student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
            />
            <Field label="Tempat Lahir" value={student.birthPlace} />
            <Field label="Tanggal Lahir" value={student.birthDate} />
            <Field label="Nomor Telepon" value={student.phone} />
          </dl>
          <div className="mt-2.5">
            <p className="text-xs text-brand-muted">Alamat</p>
            <p className="mt-0.5 text-sm text-brand-navy">{student.address}</p>
          </div>
        </section>

        <section>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
            Data Akademik
          </h3>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-3">
            <Field label="Kelas" value={student.className} />
            <Field label="Jurusan" value={student.major} />
            <Field label="Tingkat" value={String(student.grade)} />
            <Field label="Tahun Ajaran" value={student.academicYear} />
            <Field label="Wali Kelas" value={student.homeroomTeacher} />
          </dl>
        </section>

        <section>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
            Data Akun
          </h3>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-3">
            <Field label="Username / Email" value={student.email} />
            <Field
              label="Status Akun"
              value={student.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
            />
            <Field label="Dibuat Sejak" value={student.createdAt} />
          </dl>
        </section>

        <section>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-muted">
            Aktivitas
          </h3>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-3">
            <Field label="Login Terakhir" value={student.lastLogin} />
          </dl>
        </section>
      </div>
    </Modal>
  )
}