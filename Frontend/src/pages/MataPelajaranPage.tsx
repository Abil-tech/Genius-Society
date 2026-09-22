import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import AdminLayout from '../layouts/Adminlayout'
import AdminPageHeader from '../components/admin/AdminPageHeader'
import StatCard from '../components/admin/StatCard'
import EmptyState from '../components/admin/EmprtyState'
import ErrorState from '../components/admin/ErrorState'
import TableSkeleton from '../components/admin/TableSkeleton'
import Toast from '../components/admin/Toast'
import Pagination from '../components/admin/Staffpage/Pagination'
import ConfirmDeleteModal from '../components/admin/ConfirmDeleteModal'
import AdminFooter from '../components/admin/AdminFooter'
import SubjectFilters, {
  type SubjectFilterValues,
} from '../components/admin/subjects/SubjectsFilters'
import SubjectTable from '../components/admin/subjects/SubjectTable'
import SubjectCardList from '../components/admin/subjects/SubjectCardList'
import SubjectDetailModal from '../components/admin/subjects/SubjectDetailModal'
import SubjectFormModal from '../components/admin/subjects/SubjectFormModal'
import { subjectList, subjectStatsCards } from '../utils/subject'
import type { Subject, SubjectFormValues } from '../types/subject'

const PAGE_SIZE = 6

export default function MataPelajaranPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [filters, setFilters] = useState<SubjectFilterValues>({
    search: '',
    group: 'semua',
    grade: 'semua',
    status: 'semua',
  })
  const [page, setPage] = useState(1)

  const [viewingSubject, setViewingSubject] = useState<Subject | null>(null)
  const [formState, setFormState] = useState<
    { mode: 'add' } | { mode: 'edit'; subject: Subject } | null
  >(null)
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function loadData() {
    setIsLoading(true)
    setIsError(false)
    // Simulasi panggilan API — ganti dengan GET /api/subjects saat backend siap.
    setTimeout(() => {
      setSubjects(subjectList)
      setIsLoading(false)
    }, 500)
  }

  useEffect(() => {
    // isLoading sudah true sejak initial state, jadi effect ini cukup
    // menjalankan fetch-nya saja tanpa setState sinkron di awal body.
    const timer = setTimeout(() => {
      setSubjects(subjectList)
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    return subjects.filter((subject) => {
      const matchesSearch =
        filters.search.trim() === '' ||
        subject.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        subject.code.toLowerCase().includes(filters.search.toLowerCase())
      const matchesGroup =
        filters.group === 'semua' || subject.group === filters.group
      const matchesGrade =
        filters.grade === 'semua' ||
        subject.grades.includes(Number(filters.grade))
      const matchesStatus =
        filters.status === 'semua' || subject.status === filters.status
      return matchesSearch && matchesGroup && matchesGrade && matchesStatus
    })
  }, [subjects, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(page * PAGE_SIZE, filtered.length)

  function handleFilterChange(next: SubjectFilterValues) {
    setFilters(next)
    setPage(1)
  }

  function handleAddSubmit(values: SubjectFormValues) {
    setIsSubmitting(true)
    // TODO: POST /api/subjects
    setTimeout(() => {
      const newSubject: Subject = {
        id: `sub-${Date.now()}`,
        ...values,
        teachers: [],
        classes: [],
        curriculums: [],
      }
      setSubjects((prev) => [newSubject, ...prev])
      setIsSubmitting(false)
      setFormState(null)
      setToastMessage('Mata pelajaran berhasil ditambahkan.')
    }, 400)
  }

  function handleEditSubmit(subjectId: string, values: SubjectFormValues) {
    setIsSubmitting(true)
    // TODO: PUT /api/subjects/:id
    setTimeout(() => {
      setSubjects((prev) =>
        prev.map((s) => (s.id === subjectId ? { ...s, ...values } : s)),
      )
      setIsSubmitting(false)
      setFormState(null)
      setToastMessage('Perubahan mata pelajaran berhasil disimpan.')
    }, 400)
  }

  function handleDelete() {
    if (!deletingSubject) return
    setIsSubmitting(true)
    // TODO: DELETE /api/subjects/:id
    setTimeout(() => {
      setSubjects((prev) => prev.filter((s) => s.id !== deletingSubject.id))
      setIsSubmitting(false)
      setDeletingSubject(null)
      setToastMessage('Mata pelajaran berhasil dihapus.')
    }, 400)
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Mata Pelajaran"
        moduleBadge="Modul_04 // Kurikulum_Akademik"
        actions={
          <button
            onClick={() => setFormState({ mode: 'add' })}
            className="flex items-center gap-1.5 rounded-lg bg-brand-navy px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand-navy-light"
          >
            <Plus size={14} strokeWidth={2} />
            Tambah Mata Pelajaran
          </button>
        }
      />

      <p className="-mt-3 text-sm text-brand-muted">
        Kelola mata pelajaran yang digunakan dalam kegiatan pembelajaran
        Genius Society.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {subjectStatsCards.map((stat) => (
          <StatCard key={stat.code} {...stat} />
        ))}
      </div>

      <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
        <SubjectFilters values={filters} onChange={handleFilterChange} />
      </div>

      <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
        {isLoading ? (
          <TableSkeleton rows={6} />
        ) : isError ? (
          <ErrorState onRetry={loadData} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Tidak ada mata pelajaran ditemukan"
            description="Coba ubah kata kunci pencarian atau filter yang digunakan."
          />
        ) : (
          <>
            <SubjectTable
              data={paginated}
              startNumber={rangeStart}
              onView={setViewingSubject}
              onEdit={(subject) => setFormState({ mode: 'edit', subject })}
              onDelete={setDeletingSubject}
            />
            <SubjectCardList
              data={paginated}
              onView={setViewingSubject}
              onEdit={(subject) => setFormState({ mode: 'edit', subject })}
              onDelete={setDeletingSubject}
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

      <AdminFooter />

      {viewingSubject && (
        <SubjectDetailModal
          subject={viewingSubject}
          onClose={() => setViewingSubject(null)}
          onEdit={() => {
            const subject = viewingSubject
            setViewingSubject(null)
            setFormState({ mode: 'edit', subject })
          }}
        />
      )}

      {formState && (
        <SubjectFormModal
          mode={formState.mode}
          initial={formState.mode === 'edit' ? formState.subject : undefined}
          isSubmitting={isSubmitting}
          onClose={() => setFormState(null)}
          onSubmit={(values) =>
            formState.mode === 'add'
              ? handleAddSubmit(values)
              : handleEditSubmit(formState.subject.id, values)
          }
        />
      )}

      {deletingSubject && (
        <ConfirmDeleteModal
          title="Hapus Mata Pelajaran?"
          description="Data mata pelajaran yang dihapus dapat memengaruhi data pembelajaran yang terkait."
          isDeleting={isSubmitting}
          onCancel={() => setDeletingSubject(null)}
          onConfirm={handleDelete}
        />
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </AdminLayout>
  )
}