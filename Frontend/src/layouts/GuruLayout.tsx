import type { ReactNode } from 'react'
import GuruSidebar from '../components/Guru/GuruSidebar'
import AdminTopbar from '../components/admin/AdminTopbar'

interface GuruLayoutProps {
  children: ReactNode
}

export default function GuruLayout({ children }: GuruLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-brand-bg">
      <GuruSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar searchPlaceholder="Cari kelas, tugas, atau siswa..." />

        <main className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}