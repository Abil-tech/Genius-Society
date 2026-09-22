import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import AdminLayout from '../layouts/Adminlayout'
import AdminPageHeader from '../components/admin/AdminPageHeader'
import StatCard from '../components/admin/StatCard'
import EmptyState from '../components/admin/EmprtyState'
import Pagination from '../components/admin/Staffpage/Pagination'
import ConfirmDeleteModal from '../components/admin/ConfirmDeleteModal'
import Toast from '../components/admin/Toast'
import AdminFooter from '../components/admin/AdminFooter'
import ClassKurikulumTabs from '../components/admin/classes/ClassKurikulumTabs'
import ClassFilters, {
  type ClassFilterValues,
} from '../components/admin/classes/ClassFilters'
import ClassTable from '../components/admin/classes/ClassTable'
import ClassDetailModal from '../components/admin/classes/ClassDetailModal'
import ClassFormModal from '../components/admin/classes/ClassFormModal'
import CurriculumTable from '../components/admin/classes/CurriculumTable'
import CurriculumDetailModal from '../components/admin/classes/CurriculumDetailModal'
import AssignSubjectModal from '../components/admin/classes/AssignSubjectModal'
import {
  classList as initialClassList,
  curriculumList as initialCurriculumList,
  classStatsCards,
} from '../utils/classcuriculumContent'
import type {
  SchoolClass,
  SchoolClassFormValues,
  Curriculum,
  CurriculumSubject,
} from '../types/classcurriculum'

const PAGE_SIZE = 6

const emptyClassFilters: ClassFilterValues = {
  search: '',
  grade: 'semua',
  major: 'semua',
  academicYear: 'semua',
  status: 'semua',
}

export default function KelasKurikulumPage() {
  const [tab, setTab] = useState<'kelas' | 'kurikulum'>('kelas')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // --- Tab Kelas ---
  const [classes, setClasses] = useState<SchoolClass[]>(initialClassList)
  const [classFilters, setClassFilters] = useState(emptyClassFilters)
  const [classPage, setClassPage] = useState(1)
  const [viewingClass, setViewingClass] = useState<SchoolClass | null>(null)
  const [classFormState, setClassFormState] = useState<
    { mode: 'add' } | { mode: 'edit'; item: SchoolClass } | null
  >(null)
  const [deletingClass, setDeletingClass] = useState<SchoolClass | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const majorOptions = useMemo(
    () => Array.from(new Set(classes.map((c) => c.major))).filter(Boolean),
    [classes],
  )
  const academicYearOptions = useMemo(
    () => Array.from(new Set(classes.map((c) => c.academicYear))),
    [classes],
  )
  const teacherOptions = useMemo(
    () =>
      Array.from(new Set(classes.map((c) => c.homeroomTeacher))).filter(
        (t) => t && t !== '-',
      ),
    [classes],
  )

  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
      const matchesSearch =
        classFilters.search.trim() === '' ||
        item.name.toLowerCase().includes(classFilters.search.toLowerCase())
      const matchesGrade =
        classFilters.grade === 'semua' || String(item.grade) === classFilters.grade
      const matchesMajor =
        classFilters.major === 'semua' || item.major === classFilters.major
      const matchesYear =
        classFilters.academicYear === 'semua' ||
        item.academicYear === classFilters.academicYear
      const matchesStatus =
        classFilters.status === 'semua' || item.status === classFilters.status
      return (
        matchesSearch && matchesGrade && matchesMajor && matchesYear && matchesStatus
      )
    })
  }, [classes, classFilters])

  const classTotalPages = Math.max(1, Math.ceil(filteredClasses.length / PAGE_SIZE))
  const paginatedClasses = filteredClasses.slice(
    (classPage - 1) * PAGE_SIZE,
    classPage * PAGE_SIZE,
  )
  const classRangeStart =
    filteredClasses.length === 0 ? 0 : (classPage - 1) * PAGE_SIZE + 1
  const classRangeEnd = Math.min(classPage * PAGE_SIZE, filteredClasses.length)

  function handleClassFilterChange(next: ClassFilterValues) {
    setClassFilters(next)
    setClassPage(1)
  }

  function handleAddClass(values: SchoolClassFormValues) {
    setIsSubmitting(true)
    // TODO: POST /api/classes
    setTimeout(() => {
      const newClass: SchoolClass = {
        id: `cls-${Date.now()}`,
        ...values,
        students: [],
        subjects: [],
      }
      setClasses((prev) => [newClass, ...prev])
      setIsSubmitting(false)
      setClassFormState(null)
      setToastMessage('Kelas berhasil ditambahkan.')
    }, 400)
  }

  function handleEditClass(classId: string, values: SchoolClassFormValues) {
    setIsSubmitting(true)
    // TODO: PUT /api/classes/:id
    setTimeout(() => {
      setClasses((prev) =>
        prev.map((c) => (c.id === classId ? { ...c, ...values } : c)),
      )
      setIsSubmitting(false)
      setClassFormState(null)
      setToastMessage('Perubahan kelas berhasil disimpan.')
    }, 400)
  }

  function handleDeleteClass() {
    if (!deletingClass) return
    setIsSubmitting(true)
    // TODO: DELETE /api/classes/:id
    setTimeout(() => {
      setClasses((prev) => prev.filter((c) => c.id !== deletingClass.id))
      setIsSubmitting(false)
      setDeletingClass(null)
      setToastMessage('Kelas berhasil dihapus.')
    }, 400)
  }

  // --- Tab Kurikulum ---
  const [curriculums, setCurriculums] = useState<Curriculum[]>(initialCurriculumList)
  const [curriculumPage, setCurriculumPage] = useState(1)
  const [viewingCurriculum, setViewingCurriculum] = useState<Curriculum | null>(null)
  const [isAssigningSubject, setIsAssigningSubject] = useState(false)

  const curriculumTotalPages = Math.max(
    1,
    Math.ceil(curriculums.length / PAGE_SIZE),
  )
  const paginatedCurriculums = curriculums.slice(
    (curriculumPage - 1) * PAGE_SIZE,
    curriculumPage * PAGE_SIZE,
  )
  const curriculumRangeStart =
    curriculums.length === 0 ? 0 : (curriculumPage - 1) * PAGE_SIZE + 1
  const curriculumRangeEnd = Math.min(
    curriculumPage * PAGE_SIZE,
    curriculums.length,
  )

  function handleAssignSubject(subject: CurriculumSubject) {
    if (!viewingCurriculum) return
    const updated: Curriculum = {
      ...viewingCurriculum,
      subjects: [...viewingCurriculum.subjects, subject],
    }
    setCurriculums((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    )
    setViewingCurriculum(updated)
    setIsAssigningSubject(false)
    setToastMessage(`${subject.name} berhasil ditambahkan ke kurikulum.`)
  }

  function handleRemoveSubject(code: string) {
    if (!viewingCurriculum) return
    const updated: Curriculum = {
      ...viewingCurriculum,
      subjects: viewingCurriculum.subjects.filter((s) => s.code !== code),
    }
    setCurriculums((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    )
    setViewingCurriculum(updated)
    setToastMessage('Mata pelajaran dihapus dari kurikulum.')
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Kelas & Kurikulum"
        moduleBadge="Modul_03 // Struktur_Akademik"
        actions={
          tab === 'kelas' ? (
            <button
              onClick={() => setClassFormState({ mode: 'add' })}
              className="flex items-center gap-1.5 rounded-lg bg-brand-navy px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand-navy-light"
            >
              <Plus size={14} strokeWidth={2} />
              Tambah Kelas
            </button>
          ) : undefined
        }
      />

      <p className="-mt-3 text-sm text-brand-muted">
        Kelola data kelas, tahun ajaran, dan struktur kurikulum Genius Society.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {classStatsCards.map((stat) => (
          <StatCard key={stat.code} {...stat} />
        ))}
      </div>

      <div className="rounded-2xl border border-brand-navy/5 bg-white p-2">
        <ClassKurikulumTabs active={tab} onChange={setTab} />
      </div>

      {tab === 'kelas' ? (
        <>
          <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
            <ClassFilters
              values={classFilters}
              majorOptions={majorOptions}
              academicYearOptions={academicYearOptions}
              onChange={handleClassFilterChange}
            />
          </div>

          <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
            {filteredClasses.length === 0 ? (
              <EmptyState
                title="Tidak ada kelas ditemukan"
                description="Coba ubah kata kunci pencarian atau filter yang digunakan."
              />
            ) : (
              <ClassTable
                data={paginatedClasses}
                startNumber={classRangeStart}
                onView={setViewingClass}
                onEdit={(item) => setClassFormState({ mode: 'edit', item })}
                onDelete={setDeletingClass}
              />
            )}
          </div>

          {filteredClasses.length > 0 && (
            <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
              <Pagination
                currentPage={classPage}
                totalPages={classTotalPages}
                pageSize={PAGE_SIZE}
                totalItems={filteredClasses.length}
                rangeStart={classRangeStart}
                rangeEnd={classRangeEnd}
                onPageChange={setClassPage}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
            {curriculums.length === 0 ? (
              <EmptyState title="Belum ada data kurikulum" />
            ) : (
              <CurriculumTable
                data={paginatedCurriculums}
                startNumber={curriculumRangeStart}
                onView={setViewingCurriculum}
              />
            )}
          </div>

          {curriculums.length > 0 && (
            <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
              <Pagination
                currentPage={curriculumPage}
                totalPages={curriculumTotalPages}
                pageSize={PAGE_SIZE}
                totalItems={curriculums.length}
                rangeStart={curriculumRangeStart}
                rangeEnd={curriculumRangeEnd}
                onPageChange={setCurriculumPage}
              />
            </div>
          )}
        </>
      )}

      <AdminFooter />

      {viewingClass && (
        <ClassDetailModal
          item={viewingClass}
          onClose={() => setViewingClass(null)}
          onEdit={() => {
            const item = viewingClass
            setViewingClass(null)
            setClassFormState({ mode: 'edit', item })
          }}
        />
      )}

      {classFormState && (
        <ClassFormModal
          mode={classFormState.mode}
          initial={classFormState.mode === 'edit' ? classFormState.item : undefined}
          teacherOptions={teacherOptions}
          majorOptions={majorOptions}
          academicYearOptions={academicYearOptions}
          isSubmitting={isSubmitting}
          onClose={() => setClassFormState(null)}
          onSubmit={(values) =>
            classFormState.mode === 'add'
              ? handleAddClass(values)
              : handleEditClass(classFormState.item.id, values)
          }
        />
      )}

      {deletingClass && (
        <ConfirmDeleteModal
          title="Hapus Kelas?"
          description="Data kelas yang dihapus dapat memengaruhi data siswa, jadwal, dan penilaian yang terkait."
          isDeleting={isSubmitting}
          onCancel={() => setDeletingClass(null)}
          onConfirm={handleDeleteClass}
        />
      )}

      {viewingCurriculum && (
        <CurriculumDetailModal
          curriculum={viewingCurriculum}
          onClose={() => setViewingCurriculum(null)}
          onAssignSubject={() => setIsAssigningSubject(true)}
          onRemoveSubject={handleRemoveSubject}
        />
      )}

      {isAssigningSubject && viewingCurriculum && (
        <AssignSubjectModal
          excludeCodes={viewingCurriculum.subjects.map((s) => s.code)}
          onClose={() => setIsAssigningSubject(false)}
          onAssign={handleAssignSubject}
        />
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </AdminLayout>
  )
}