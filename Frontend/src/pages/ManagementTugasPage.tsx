import { useEffect, useMemo, useState } from 'react'
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
import TaskManagementFilters from '../components/admin/tugas/TaskManagementFilters'
import {
  emptyTaskManagementFilters,
  type TaskManagementFilterValues,
} from '../types/taskManagementFilters'
import TaskManagementTable from '../components/admin/tugas/TaskManagementTable'
import TaskManagementCardList from '../components/admin/tugas/TaskManagementCardList'
import TaskManagementDetailModal from '../components/admin/tugas/TaskManagementDetailModal'
import TaskEditModal from '../components/admin/tugas/TaskEditModal'
import { taskList, taskStatsCards } from '../utils/taskManagementContent'
import { isToday, isWithinLastDays } from '../utils/dateFormat'
import type { Task, TaskEditValues } from '../types/task'

const PAGE_SIZE = 8

export default function ManagementTugasPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [filters, setFilters] = useState<TaskManagementFilterValues>(
    emptyTaskManagementFilters,
  )
  const [page, setPage] = useState(1)

  const [viewingTask, setViewingTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [archivingTask, setArchivingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function loadData() {
    setIsLoading(true)
    setIsError(false)
    // Simulasi panggilan API — ganti dengan GET /admin/tasks saat backend siap.
    setTimeout(() => {
      setTasks(taskList)
      setIsLoading(false)
    }, 500)
  }

  useEffect(() => {
    setIsLoading(true)
    setIsError(false)
    fetch('http://localhost:8080/api/admin/assignments', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.assignments) {
          setTasks(data.data.assignments)
        } else {
          setTasks(taskList) // fallback
        }
      })
      .catch((err) => {
        console.error("Failed to fetch assignments", err)
        setIsError(true)
        setTasks(taskList)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const teacherOptions = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.teacher))),
    [tasks],
  )
  const subjectOptions = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.subject))),
    [tasks],
  )
  const classOptions = useMemo(
    () => Array.from(new Set(tasks.flatMap((t) => t.classNames))),
    [tasks],
  )
  const academicYearOptions = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.academicYear))),
    [tasks],
  )

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      const q = filters.search.trim().toLowerCase()
      const matchesSearch =
        q === '' ||
        task.title.toLowerCase().includes(q) ||
        task.teacher.toLowerCase().includes(q) ||
        task.subject.toLowerCase().includes(q) ||
        task.classNames.some((c) => c.toLowerCase().includes(q))

      const matchesTeacher = filters.teacher === 'semua' || task.teacher === filters.teacher
      const matchesSubject = filters.subject === 'semua' || task.subject === filters.subject
      const matchesClass =
        filters.className === 'semua' || task.classNames.includes(filters.className)
      const matchesStatus = filters.status === 'semua' || task.status === filters.status
      const matchesYear =
        filters.academicYear === 'semua' || task.academicYear === filters.academicYear

      let matchesDate = true
      if (filters.dateRange === 'hari_ini') {
        matchesDate = isToday(task.deadline)
      } else if (filters.dateRange === '7_hari') {
        matchesDate = isWithinLastDays(task.deadline, 7)
      } else if (filters.dateRange === '30_hari') {
        matchesDate = isWithinLastDays(task.deadline, 30)
      } else if (filters.dateRange === 'custom' && filters.customFrom && filters.customTo) {
        const deadline = new Date(task.deadline).getTime()
        matchesDate =
          deadline >= new Date(filters.customFrom).getTime() &&
          deadline <= new Date(filters.customTo).getTime()
      }

      return (
        matchesSearch &&
        matchesTeacher &&
        matchesSubject &&
        matchesClass &&
        matchesStatus &&
        matchesYear &&
        matchesDate
      )
    })
  }, [tasks, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(page * PAGE_SIZE, filtered.length)

  function handleFilterChange(next: TaskManagementFilterValues) {
    setFilters(next)
    setPage(1)
  }

  function handleEditSubmit(values: TaskEditValues) {
    if (!editingTask) return
    setIsSubmitting(true)
    // TODO: PUT /admin/tasks/:id
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                title: values.title,
                description: values.description,
                teacher: values.teacher,
                subject: values.subject,
                classNames: values.classNames,
                startDate: new Date(values.startDate).toISOString(),
                deadline: new Date(values.deadline).toISOString(),
                status: values.status,
              }
            : t,
        ),
      )
      setIsSubmitting(false)
      setEditingTask(null)
      setToastMessage('Tugas berhasil diperbarui.')
    }, 400)
  }

  function handleArchive() {
    if (!archivingTask) return
    setIsSubmitting(true)
    // TODO: PATCH /admin/tasks/:id/status { status: 'diarsipkan' }
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === archivingTask.id ? { ...t, status: 'diarsipkan' } : t,
        ),
      )
      setIsSubmitting(false)
      setArchivingTask(null)
      setToastMessage('Tugas berhasil diarsipkan.')
    }, 400)
  }

  function handleDelete() {
    if (!deletingTask) return
    setIsSubmitting(true)
    // TODO: DELETE /admin/tasks/:id — backend sebaiknya cek submission/nilai
    // terkait dan pakai soft delete kalau ada riwayat akademik.
    setTimeout(() => {
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id))
      setIsSubmitting(false)
      setDeletingTask(null)
      setToastMessage('Tugas berhasil dihapus.')
    }, 400)
  }

  const isEmptyFilterResult = !isLoading && !isError && filtered.length === 0

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Management Tugas"
        moduleBadge="Modul_05 // Monitoring_Pembelajaran"
      />
      <p className="-mt-3 text-sm text-brand-muted">
        Kelola dan pantau tugas yang dibuat oleh guru dalam kegiatan pembelajaran.
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
          {taskStatsCards.map((stat) => (
            <StatCard key={stat.code} {...stat} />
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
        {isLoading ? (
          <div className="h-9 w-full animate-pulse rounded-lg bg-brand-bg" />
        ) : (
          <TaskManagementFilters
            values={filters}
            teacherOptions={teacherOptions}
            subjectOptions={subjectOptions}
            classOptions={classOptions}
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
            title="Belum ada tugas"
            description="Tidak ditemukan tugas yang sesuai dengan pencarian atau filter."
          />
        ) : (
          <>
            <TaskManagementTable
              data={paginated}
              startNumber={rangeStart}
              onView={setViewingTask}
              onEdit={setEditingTask}
              onArchive={setArchivingTask}
              onDelete={setDeletingTask}
            />
            <TaskManagementCardList
              data={paginated}
              onView={setViewingTask}
              onEdit={setEditingTask}
              onArchive={setArchivingTask}
              onDelete={setDeletingTask}
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

      {viewingTask && (
        <TaskManagementDetailModal
          task={viewingTask}
          onClose={() => setViewingTask(null)}
          onEdit={() => {
            const task = viewingTask
            setViewingTask(null)
            setEditingTask(task)
          }}
        />
      )}

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          teacherOptions={teacherOptions}
          subjectOptions={subjectOptions}
          classOptions={classOptions}
          isSubmitting={isSubmitting}
          onClose={() => setEditingTask(null)}
          onSubmit={handleEditSubmit}
        />
      )}

      {archivingTask && (
        <ConfirmDeleteModal
          title="Arsipkan Tugas?"
          description="Tugas yang diarsipkan tidak akan tampil sebagai tugas aktif."
          tone="warning"
          confirmLabel="Arsipkan"
          loadingLabel="Mengarsipkan..."
          isDeleting={isSubmitting}
          onCancel={() => setArchivingTask(null)}
          onConfirm={handleArchive}
        />
      )}

      {deletingTask && (
        <ConfirmDeleteModal
          title="Hapus Tugas?"
          description="Data tugas akan dihapus dan dapat memengaruhi data pengumpulan yang terkait. Pastikan tindakan ini benar-benar diperlukan."
          isDeleting={isSubmitting}
          onCancel={() => setDeletingTask(null)}
          onConfirm={handleDelete}
        />
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </AdminLayout>
  )
}