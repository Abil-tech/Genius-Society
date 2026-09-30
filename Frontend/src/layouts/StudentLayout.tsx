import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { SidebarNav } from '../components/layout/SidebarNav'
import { Topbar } from '../components/layout/Topbar'
import { useAsync } from '../hooks/useAsync'
import { getCurrentStudent, getUnreadNotificationCount } from '../services/studentService'
import type { StudentProfile } from '../types/student'

export interface StudentOutletContext {
  student: StudentProfile | null
}

export default function StudentLayout() {
  const { data: student } = useAsync(getCurrentStudent)
  const { data: unread } = useAsync(getUnreadNotificationCount)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  const closeDrawer = () => {
    setDrawerOpen(false)
    menuBtnRef.current?.focus()
  }

  // Tutup drawer saat pindah halaman.
  useEffect(() => setDrawerOpen(false), [pathname])

  // Tutup drawer jika viewport melebar ke tablet/desktop.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = (e: MediaQueryListEvent) => e.matches && setDrawerOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Saat drawer terbuka: kunci scroll body, fokus ke tombol tutup, Escape menutup.
  useEffect(() => {
    if (!drawerOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false)
        menuBtnRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [drawerOpen])

  return (
    <div className="min-h-dvh md:flex">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-cream-50"
      >
        Lewati ke konten
      </a>

      {/* Sidebar permanen: tablet = ikon saja, desktop = penuh */}
      <aside className="hidden shrink-0 border-r border-line bg-cream-50 md:block md:w-[76px] lg:w-64">
        <div className="sticky top-0 h-dvh overflow-y-auto">
          <SidebarNav student={student} collapsible />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          ref={menuBtnRef}
          student={student}
          unreadCount={unread ?? 0}
          drawerOpen={drawerOpen}
          onMenuClick={() => setDrawerOpen(true)}
        />

        <main id="konten" className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet context={{ student } satisfies StudentOutletContext} />
          </div>
        </main>

        <footer className="border-t border-line px-4 py-4 font-mono text-xs text-ink-soft sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 sm:flex-row sm:justify-between">
            <span>Genius Society</span>
            <span>© {new Date().getFullYear()} Genius Society Learning Systems.</span>
          </div>
        </footer>
      </div>

      {/* Drawer mobile */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Tutup menu navigasi"
            tabIndex={-1}
            onClick={closeDrawer}
            className="absolute inset-0 bg-ink/50"
          />
          <div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-cream-50 shadow-xl"
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeDrawer}
              aria-label="Tutup menu navigasi"
              className="absolute right-2 top-3 inline-flex size-11 items-center justify-center rounded-lg hover:bg-cream-100"
            >
              <X aria-hidden className="size-5" />
            </button>
            <SidebarNav student={student} onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
