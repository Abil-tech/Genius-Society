import { useEffect, useMemo, useState } from 'react'
import { FileSpreadsheet, Download, Plus, Loader2, AlertCircle } from 'lucide-react'
import AdminLayout from '../layouts/Adminlayout'
import AdminPageHeader from '../components/admin/AdminPageHeader'
import PersonnelStatsRow from '../components/admin/Staffpage/PersonnelStatsRow'
import PersonnelTabs from '../components/admin/Staffpage/PersonnelTabs'
import PersonnelFilters from '../components/admin/Staffpage/PersonnelFilters'
import PersonnelTable from '../components/admin/Staffpage/PersonnelTable'
import Pagination from '../components/admin/Staffpage/Pagination'
import AdminFooter from '../components/admin/AdminFooter'
import PersonnelFormModal, { type PersonnelFormValues } from '../components/admin/Staffpage/PersonnelFormModal'
import PersonnelDetailModal from '../components/admin/Staffpage/PersonnelDetailModal'
import ConfirmDeleteModal from '../components/admin/ConfirmDeleteModal'
import Toast from '../components/admin/Toast'
import { fetchPersonnelPage, createPersonnel, updatePersonnel, deletePersonnel } from '../services/personnelService'
import type { Personnel } from '../types/Personnel'

const PAGE_SIZE = 8

export default function GuruStafPage() {
  const [tab, setTab] = useState<'semua' | 'guru' | 'staf'>('semua')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [personnelList, setPersonnelList] = useState<Personnel[]>([])
  const [statsState, setStatsState] = useState<{
    totalGuru: number
    totalStaf: number
    guruAktif: number
    stafAktif: number
    guruAktifRate: number
    stafAktifRate: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Modal states
  const [formModalState, setFormModalState] = useState<{
    isOpen: boolean
    mode: 'add' | 'edit'
    personnel?: Personnel
  }>({ isOpen: false, mode: 'add' })

  const [detailPersonnel, setDetailPersonnel] = useState<Personnel | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Personnel | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'danger' } | null>(null)

  function showToast(message: string, tone: 'success' | 'danger' = 'success') {
    setToast({ message, tone })
  }

  async function loadPersonnel() {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const { personnel, stats } = await fetchPersonnelPage()
      setPersonnelList(personnel)
      setStatsState(stats)
    } catch {
      setErrorMessage('Gagal memuat data guru & staf. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPersonnel()
  }, [])

  const guruCount = personnelList.filter((p) => p.type === 'guru').length
  const stafCount = personnelList.filter((p) => p.type === 'staf').length

  const filtered = useMemo(() => {
    return personnelList.filter((person) => {
      const matchesTab = tab === 'semua' || person.type === tab
      const matchesSearch =
        search.trim() === '' ||
        person.name.toLowerCase().includes(search.toLowerCase()) ||
        person.nip.includes(search)
      return matchesTab && matchesSearch
    })
  }, [tab, search, personnelList])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(page * PAGE_SIZE, filtered.length)

  function handleTabChange(next: 'semua' | 'guru' | 'staf') {
    setTab(next)
    setPage(1)
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleReset() {
    setSearch('')
    setTab('semua')
    setPage(1)
  }

  // Action Handlers
  function handleOpenAdd() {
    setFormModalState({ isOpen: true, mode: 'add' })
  }

  function handleOpenEdit(personnel: Personnel) {
    setFormModalState({ isOpen: true, mode: 'edit', personnel })
  }

  function handleOpenView(personnel: Personnel) {
    setDetailPersonnel(personnel)
  }

  function handleOpenDelete(personnel: Personnel) {
    setDeleteTarget(personnel)
  }

  async function handleFormSubmit(values: PersonnelFormValues) {
    setIsSubmitting(true)
    try {
      if (formModalState.mode === 'add') {
        const newPerson = await createPersonnel({
          name: values.name,
          email: values.email,
          role: values.type === 'guru' ? 'guru' : 'staf' as any,
          nip: values.nip || undefined,
          status: values.status,
          subject: values.assignment,
        })
        // Local state update fallback/optimistic
        setPersonnelList((prev) => [
          {
            id: newPerson?.id || `p-${Date.now()}`,
            nip: values.nip || '-',
            name: values.name,
            email: values.email,
            initials: values.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
            avatarTone: 'orange',
            type: values.type,
            role: values.role,
            assignment: values.assignment,
            homeroom: {
              isHomeroom: values.isHomeroom,
              className: values.homeroomClass,
            },
            status: values.status,
          },
          ...prev,
        ])
        showToast('Berhasil menambahkan guru/staf baru.')
      } else if (formModalState.personnel) {
        await updatePersonnel(formModalState.personnel.id, {
          name: values.name,
          email: values.email,
          nip: values.nip || undefined,
          status: values.status,
          subject: values.assignment,
        })
        setPersonnelList((prev) =>
          prev.map((p) =>
            p.id === formModalState.personnel?.id
              ? {
                  ...p,
                  name: values.name,
                  email: values.email,
                  nip: values.nip,
                  type: values.type,
                  role: values.role,
                  assignment: values.assignment,
                  homeroom: {
                    isHomeroom: values.isHomeroom,
                    className: values.homeroomClass,
                  },
                  status: values.status,
                }
              : p
          )
        )
        showToast('Berhasil memperbarui data guru/staf.')
      }
      setFormModalState({ isOpen: false, mode: 'add' })
    } catch {
      showToast('Terjadi kesalahan saat menyimpan data.', 'danger')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deletePersonnel(deleteTarget.id)
      setPersonnelList((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      showToast('Data guru/staf berhasil dihapus.')
      setDeleteTarget(null)
    } catch {
      showToast('Gagal menghapus data guru/staf.', 'danger')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Guru & Staf"
        moduleBadge="Modul_02 // Personel_Operasional"
        actions={
          <>
            <button className="flex items-center gap-1.5 rounded-lg border border-brand-navy/10 bg-white px-3.5 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-bg">
              <FileSpreadsheet size={14} strokeWidth={2} />
              Import Excel
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-brand-navy/10 bg-white px-3.5 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-bg">
              <Download size={14} strokeWidth={2} />
              Export Data
            </button>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 rounded-lg bg-brand-navy px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand-navy-light"
            >
              <Plus size={14} strokeWidth={2} />
              Tambah Guru / Staf
            </button>
          </>
        }
      />

      <PersonnelStatsRow stats={statsState} />

      <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
        <PersonnelTabs
          active={tab}
          onChange={handleTabChange}
          total={personnelList.length}
          guruCount={guruCount}
          stafCount={stafCount}
        />

        <div className="mt-4">
          <PersonnelFilters
            searchValue={search}
            onSearchChange={handleSearchChange}
            onReset={handleReset}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-brand-navy/5 bg-white p-10 text-sm text-brand-navy/60">
          <Loader2 size={18} className="animate-spin" />
          Memuat data guru & staf...
        </div>
      ) : errorMessage ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-10 text-sm text-red-600">
          <AlertCircle size={18} />
          {errorMessage}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center rounded-2xl border border-brand-navy/5 bg-white p-10 text-sm text-brand-navy/60">
          Tidak ada guru/staf yang cocok dengan pencarian atau filter ini.
        </div>
      ) : (
        <PersonnelTable
          data={paginated}
          total={filtered.length}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

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

      {/* Modals */}
      {formModalState.isOpen && (
        <PersonnelFormModal
          mode={formModalState.mode}
          initial={formModalState.personnel}
          onClose={() => setFormModalState({ isOpen: false, mode: 'add' })}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {detailPersonnel && (
        <PersonnelDetailModal
          personnel={detailPersonnel}
          onClose={() => setDetailPersonnel(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          title="Hapus Personel"
          description={`Apakah Anda yakin ingin menghapus data "${deleteTarget.name}"? Akses akun dan data penugasan akan dihapus.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          tone={toast.tone}
          onClose={() => setToast(null)}
        />
      )}

      <AdminFooter />
    </AdminLayout>
  )
}