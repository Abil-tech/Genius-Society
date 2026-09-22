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
import { fetchPersonnelPage } from '../services/personnelService'
import type { Personnel } from '../types/Personnel'

const PAGE_SIZE = 8

export default function GuruStafPage() {
  const [tab, setTab] = useState<'semua' | 'guru' | 'staf'>('semua')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // NOTE: PersonnelStatsRow di bawah masih dipanggil TANPA props — kartu
  // statistik itu kemungkinan masih menampilkan data dummy internal
  // sampai komponennya juga disambungkan menerima data dari
  // fetchPersonnelPage().stats. Di luar scope perubahan file ini.

  const [personnelList, setPersonnelList] = useState<Personnel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadPersonnel() {
      setIsLoading(true)
      setErrorMessage(null)
      try {
        const { personnel } = await fetchPersonnelPage()
        if (isMounted) setPersonnelList(personnel)
      } catch (err) {
        if (isMounted) {
          setErrorMessage(
            'Gagal memuat data guru & staf. Silakan coba lagi.'
          )
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadPersonnel()
    return () => {
      isMounted = false
    }
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
            <button className="flex items-center gap-1.5 rounded-lg bg-brand-navy px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand-navy-light">
              <Plus size={14} strokeWidth={2} />
              Tambah Guru / Staf
            </button>
          </>
        }
      />

      <PersonnelStatsRow />

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
        <PersonnelTable data={paginated} total={filtered.length} />
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

      <AdminFooter />
    </AdminLayout>
  )
}