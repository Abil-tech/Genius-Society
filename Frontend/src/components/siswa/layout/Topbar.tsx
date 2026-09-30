import { forwardRef } from 'react'
import { Bell, Menu } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import type { StudentProfile } from '../../types/student'
import { Avatar } from './Avatar'
import { studentNav } from './navItems'

interface Props {
  student: StudentProfile | null
  unreadCount: number
  drawerOpen: boolean
  onMenuClick: () => void
}

export const Topbar = forwardRef<HTMLButtonElement, Props>(function Topbar(
  { student, unreadCount, drawerOpen, onMenuClick },
  menuRef,
) {
  const { pathname } = useLocation()
  const current =
    studentNav.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)))?.label ??
    'Genius Society'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-line bg-cream-50/95 px-3 backdrop-blur sm:px-6 lg:px-8">
      <button
        ref={menuRef}
        type="button"
        onClick={onMenuClick}
        aria-label="Buka menu navigasi"
        aria-expanded={drawerOpen}
        aria-controls="mobile-nav"
        className="-ml-1 inline-flex size-11 items-center justify-center rounded-lg hover:bg-cream-100 md:hidden"
      >
        <Menu aria-hidden className="size-6" />
      </button>

      <p className="min-w-0 flex-1 truncate font-semibold md:font-mono md:text-sm md:font-normal md:text-ink-soft">
        <span className="md:hidden">{current}</span>
        <span className="hidden md:inline">Genius Society</span>
      </p>

      <Link
        to="/student/notifikasi"
        aria-label={unreadCount > 0 ? `Notifikasi, ${unreadCount} belum dibaca` : 'Notifikasi'}
        className="relative inline-flex size-11 items-center justify-center rounded-lg hover:bg-cream-100"
      >
        <Bell aria-hidden className="size-5" />
        {unreadCount > 0 ? (
          <span
            aria-hidden
            className="absolute right-1.5 top-1.5 flex min-w-[1.125rem] items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold leading-[1.125rem] text-ink"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </Link>

      {student ? (
        <span className="inline-flex size-11 items-center justify-center" title={student.name}>
          <Avatar name={student.name} className="size-9" />
          <span className="sr-only">Profil: {student.name}</span>
        </span>
      ) : (
        <span aria-hidden className="size-9 animate-pulse rounded-full bg-cream-100" />
      )}
    </header>
  )
})
