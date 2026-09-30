import { useEffect, useMemo, useState } from 'react'
import { Plus, Upload, Download, Users, CheckCircle2, XCircle, School } from 'lucide-react'
import AdminLayout from '../layouts/Adminlayout'
import AdminPageHeader from '../components/admin/AdminPageHeader'
import StatCard from '../components/admin/StatCard'
import EmptyState from '../components/admin/EmptyState'
import ErrorState from '../components/admin/ErrorState'
import TableSkeleton from '../components/admin/TableSkeleton'
import Toast from '../components/admin/Toast'
import Pagination from '../components/admin/Staffpage/Pagination'
import ConfirmDeleteModal from '../components/admin/ConfirmDeleteModal'
import AdminFooter from '../components/admin/AdminFooter'
import StudentFilters, {
  type StudentFilterValues,
} from '../components/admin/students/StudentFilters'
import StudentTable from '../components/admin/students/StudentTable'
import StudentCardList from '../components/admin/students/StudentCardList'
import StudentDetailModal from '../components/admin/students/StudentDetailModal'
import StudentFormModal from '../components/admin/students/StudentFormModal'
import ImportStudentModal from '../components/admin/students/ImportStudentModal'
import { studentList, studentStatsCards } from '../utils/StudentContent'
import { toCsv, downloadCsv } from '../utils/Csv'
import type { Student, StudentFormValues } from '../types/Student'
import { fetchClasses, type ClassResponse } from '../services/academicService'
import {
  fetchStudentPage,
  createStudent,
  updateStudent,
  deleteStudent,
  type StudentStatsResponse,
} from '../services/studentService'

const PAGE_SIZE = 10

const emptyFilters: StudentFilterValues = {
  search: '',
  className: 'semua',
  grade: 'semua',
  major: 'semua',
  academicYear: 'semua',
  status: 'semua',
  gender: 'semua',
}

export default function SiswaPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [statsState, setStatsState] = useState<StudentStatsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [filters, setFilters] = useState<StudentFilterValues>(emptyFilters)
  const [page, setPage] = useState(1)

  const [viewingStudent, setViewingStudent] = useState<Student | null>(null)
  const [formState, setFormState] = useState<
    { mode: 'add' } | { mode: 'edit'; student: Student } | null
  >(null)
  const [statusTarget, setStatusTarget] = useState<Student | null>(null)
  const [resetPasswordTarget, setResetPasswordTarget] = useState<Student | null>(null)
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [backendClasses, setBackendClasses] = useState<ClassResponse[]>([])

  async function loadData() {
    setIsLoading(true)
    setIsError(false)
    try {
      const [res, classRes] = await Promise.all([
        fetchStudentPage(),
        fetchClasses()
      ])
      setStudents(res.students || [])
      if (res.stats) {
        setStatsState(res.stats)
      }
      setBackendClasses(classRes.classes || [])
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const classOptions = useMemo(
    () => Array.from(new Set([
      ...backendClasses.map((c) => c.name),
      ...students.map((s) => s.className)
    ])).filter(Boolean),
    [backendClasses, students],
  )
  const majorOptions = useMemo(
    () => Array.from(new Set([
      ...backendClasses.map((c) => c.major),
      ...students.map((s) => s.major)
    ])).filter(Boolean),
    [backendClasses, students],
  )
  const academicYearOptions = useMemo(
    () => Array.from(new Set([
      ...backendClasses.map((c) => c.academic_year),
      ...students.map((s) => s.academicYear)
    ])).filter(Boolean),
    [backendClasses, students],
  )

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = filters.search.trim().toLowerCase()
      const matchesSearch =
        q === '' ||
        s.name.toLowerCase().includes(q) ||
        s.nis.includes(q) ||
        s.nisn.includes(q) ||
        s.email.toLowerCase().includes(q)
      const matchesClass =
        filters.className === 'semua' || s.className === filters.className
      const matchesGrade =
        filters.grade === 'semua' || String(s.grade) === filters.grade
      const matchesMajor = filters.major === 'semua' || s.major === filters.major
      const matchesYear =
        filters.academicYear === 'semua' || s.academicYear === filters.academicYear
      const matchesStatus =
        filters.status === 'semua' || s.status === filters.status
      const matchesGender =
        filters.gender === 'semua' || s.gender === filters.gender

      return (
        matchesSearch &&
        matchesClass &&
        matchesGrade &&
        matchesMajor &&
        matchesYear &&
        matchesStatus &&
        matchesGender
      )
    })
  }, [students, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(page * PAGE_SIZE, filtered.length)

  function handleFilterChange(next: StudentFilterValues) {
    setFilters(next)
    setPage(1)
  }

  async function handleAddSubmit(values: StudentFormValues) {
    setIsSubmitting(true)
    try {
      const newStudent = await createStudent(values)
      setStudents((prev) => [newStudent, ...prev])
      setFormState(null)
      setToastMessage('Siswa berhasil ditambahkan.')
    } catch {
      setToastMessage('Gagal menambahkan siswa.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleEditSubmit(studentId: string, values: StudentFormValues) {
    setIsSubmitting(true)
    try {
      const updated = await updateStudent(studentId, values)
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, ...updated } : s)),
      )
      setFormState(null)
      setToastMessage('Data siswa berhasil diperbarui.')
    } catch {
      setToastMessage('Gagal memperbarui data siswa.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleToggleStatus() {
    if (!statusTarget) return
    setIsSubmitting(true)
    const nextStatus = statusTarget.status === 'aktif' ? 'nonaktif' : 'aktif'
    try {
      await updateStudent(statusTarget.id, { ...statusTarget, status: nextStatus })
      setStudents((prev) =>
        prev.map((s) =>
          s.id === statusTarget.id ? { ...s, status: nextStatus } : s,
        ),
      )
      setStatusTarget(null)
      setToastMessage(
        nextStatus === 'nonaktif'
          ? 'Siswa berhasil dinonaktifkan.'
          : 'Siswa berhasil diaktifkan kembali.',
      )
    } catch {
      setToastMessage('Gagal mengubah status siswa.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleResetPassword() {
    if (!resetPasswordTarget) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setResetPasswordTarget(null)
      setToastMessage(
        `Link reset password berhasil dikirim ke ${resetPasswordTarget.email}.`,
      )
    }, 400)
  }

  async function handleDelete() {
    if (!deletingStudent) return
    setIsSubmitting(true)
    try {
      await deleteStudent(deletingStudent.id)
      setStudents((prev) => prev.filter((s) => s.id !== deletingStudent.id))
      setDeletingStudent(null)
      setToastMessage('Data siswa berhasil dihapus.')
    } catch {
      setToastMessage('Gagal menghapus data siswa.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleImport(newStudents: Student[]) {
    setStudents((prev) => [...newStudents, ...prev])
    setIsImporting(false)
    setToastMessage(`${newStudents.length} siswa berhasil diimpor.`)
  }

  function handleExport() {
    // Export menghormati filter yang sedang aktif, dan tidak pernah
    // menyertakan password/hash/token — Student type memang tidak
    // menyimpan field itu di frontend.
    const headers = [
      'Nama',
      'NIS',
      'NISN',
      'Email',
      'Kelas',
      'Jurusan',
      'Tingkat',
      'Tahun Ajaran',
      'Jenis Kelamin',
      'Status',
    ]
    const rows = filtered.map((s) => [
      s.name,
      s.nis,
      s.nisn,
      s.email,
      s.className,
      s.major,
      s.grade,
      s.academicYear,
      s.gender === 'L' ? 'Laki-laki' : 'Perempuan',
      s.status,
    ])
    downloadCsv(`data-siswa-${Date.now()}.csv`, toCsv(headers, rows))
    setToastMessage(`${filtered.length} data siswa berhasil diekspor.`)
  }

  const displayStatsCards = useMemo(() => {
    if (!statsState) return studentStatsCards
    return [
      {
        code: 'DATA_01',
        label: 'Total Siswa',
        value: statsState.total.toLocaleString('id-ID'),
        icon: Users,
      },
      {
        code: 'DATA_02',
        label: 'Siswa Aktif',
        value: statsState.active.toLocaleString('id-ID'),
        icon: CheckCircle2,
        highlighted: true,
        badge: 'Aktif',
      },
      {
        code: 'DATA_03',
        label: 'Siswa Nonaktif',
        value: statsState.inactive.toLocaleString('id-ID'),
        icon: XCircle,
      },
      {
        code: 'DATA_04',
        label: 'Total Kelas',
        value: String(statsState.totalClasses),
        icon: School,
      },
    ]
  }, [statsState])

  const isEmptyDataset = !isLoading && !isError && students.length === 0
  const isEmptyFilterResult =
    !isLoading && !isError && students.length > 0 && filtered.length === 0

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Siswa"
        moduleBadge="Modul_02 // Management_Siswa"
        actions={
          <>
            <button
              onClick={() => setIsImporting(true)}
              className="flex items-center gap-1.5 rounded-lg border border-brand-navy/10 bg-white px-3.5 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-bg"
            >
              <Upload size={14} strokeWidth={2} />
              Import Siswa
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-lg border border-brand-navy/10 bg-white px-3.5 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-bg"
            >
              <Download size={14} strokeWidth={2} />
              Export
            </button>
            <button
              onClick={() => setFormState({ mode: 'add' })}
              className="flex items-center gap-1.5 rounded-lg bg-brand-navy px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand-navy-light"
            >
              <Plus size={14} strokeWidth={2} />
              Tambah Siswa
            </button>
          </>
        }
      />

      <p className="-mt-3 text-sm text-brand-muted">
        Kelola data siswa yang terdaftar di Genius Society.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-brand-navy/5 bg-brand-bg"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {displayStatsCards.map((stat) => (
            <StatCard key={stat.code} {...stat} />
          ))}
        </div>
      )}

      {isEmptyDataset ? (
        <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
          <EmptyState
            title="Belum ada data siswa"
            description="Belum terdapat data siswa yang tersedia."
          />
          <div className="flex justify-center">
            <button
              onClick={() => setFormState({ mode: 'add' })}
              className="rounded-lg bg-brand-orange px-4 py-2 text-xs font-semibold text-white hover:bg-brand-orange-dark"
            >
              Tambah Siswa
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
            {isLoading ? (
              <div className="h-9 w-full animate-pulse rounded-lg bg-brand-bg" />
            ) : (
              <StudentFilters
                values={filters}
                classOptions={classOptions}
                majorOptions={majorOptions}
                academicYearOptions={academicYearOptions}
                onChange={handleFilterChange}
              />
            )}
          </div>

          <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
            {isLoading ? (
              <TableSkeleton rows={6} />
            ) : isError ? (
              <ErrorState onRetry={loadData} />
            ) : isEmptyFilterResult ? (
              <EmptyState
                title="Data siswa tidak ditemukan"
                description="Tidak ada siswa yang sesuai dengan pencarian atau filter yang dipilih."
              />
            ) : (
              <>
                <StudentTable
                  data={paginated}
                  startNumber={rangeStart}
                  onView={setViewingStudent}
                  onEdit={(s) => setFormState({ mode: 'edit', student: s })}
                  onToggleStatus={setStatusTarget}
                  onResetPassword={setResetPasswordTarget}
                  onDelete={setDeletingStudent}
                />
                <StudentCardList
                  data={paginated}
                  onView={setViewingStudent}
                  onEdit={(s) => setFormState({ mode: 'edit', student: s })}
                  onToggleStatus={setStatusTarget}
                  onResetPassword={setResetPasswordTarget}
                  onDelete={setDeletingStudent}
                />
              </>
            )}
          </div>

          {!isLoading && !isError && filtered.length > 0 && (
            <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                pageSize={PAGE_SIZE}
                totalItems={filtered.length}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      <AdminFooter />

      {viewingStudent && (
        <StudentDetailModal
          student={viewingStudent}
          onClose={() => setViewingStudent(null)}
          onEdit={() => {
            const student = viewingStudent
            setViewingStudent(null)
            setFormState({ mode: 'edit', student })
          }}
        />
      )}

      {formState && (
        <StudentFormModal
          mode={formState.mode}
          initial={formState.mode === 'edit' ? formState.student : undefined}
          existingStudents={students}
          classOptions={classOptions}
          majorOptions={majorOptions}
          academicYearOptions={academicYearOptions}
          isSubmitting={isSubmitting}
          onClose={() => setFormState(null)}
          onSubmit={(values) =>
            formState.mode === 'add'
              ? handleAddSubmit(values)
              : handleEditSubmit(formState.student.id, values)
          }
        />
      )}

      {statusTarget && (
        <ConfirmDeleteModal
          title={
            statusTarget.status === 'aktif' ? 'Nonaktifkan Siswa?' : 'Aktifkan Siswa?'
          }
          description={
            statusTarget.status === 'aktif'
              ? 'Siswa tidak dapat masuk ke akun Genius Society sampai akun diaktifkan kembali.'
              : 'Siswa akan bisa masuk kembali ke akun Genius Society setelah diaktifkan.'
          }
          tone="warning"
          confirmLabel={statusTarget.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
          loadingLabel="Memproses..."
          isDeleting={isSubmitting}
          onCancel={() => setStatusTarget(null)}
          onConfirm={handleToggleStatus}
        />
      )}

      {resetPasswordTarget && (
        <ConfirmDeleteModal
          title="Reset Password Siswa?"
          description={`Link reset password akan dikirim ke ${resetPasswordTarget.email}. Password saat ini tidak akan ditampilkan.`}
          tone="warning"
          confirmLabel="Reset Password"
          loadingLabel="Mengirim..."
          isDeleting={isSubmitting}
          onCancel={() => setResetPasswordTarget(null)}
          onConfirm={handleResetPassword}
        />
      )}

      {deletingStudent && (
        <ConfirmDeleteModal
          title="Hapus Data Siswa?"
          description="Data siswa yang dihapus tidak dapat dipulihkan. Pastikan Anda benar-benar ingin menghapus data ini."
          isDeleting={isSubmitting}
          onCancel={() => setDeletingStudent(null)}
          onConfirm={handleDelete}
        />
      )}

      {isImporting && (
        <ImportStudentModal
          existingStudents={students}
          classOptions={classOptions}
          onClose={() => setIsImporting(false)}
          onImport={handleImport}
        />
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </AdminLayout>
  )
}