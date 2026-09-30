import { NavLink } from 'react-router-dom'
import type { StudentProfile } from '../../types/student'
import { Avatar } from './Avatar'
import { studentNav } from './navItems'

interface Props {
  student: StudentProfile | null
  /** true = mode sidebar permanen: ikon saja di tablet (md), penuh di desktop (lg+). */
  collapsible?: boolean
  onNavigate?: () => void
}

export function SidebarNav({ student, collapsible = false, onNavigate }: Props) {
  // Pada mode collapsed label tetap ada untuk screen reader (sr-only), bukan display:none.
  const label = collapsible ? 'md:sr-only lg:not-sr-only' : ''
  const center = collapsible ? 'justify-center lg:justify-start' : ''

  return (
    <div className="flex h-full flex-col gap-6 py-5">
      <div className={collapsible ? 'px-2 lg:px-5' : 'px-5'}>
        <p className={`text-xl font-bold text-brand-strong ${collapsible ? 'text-center lg:text-left' : ''}`}>
          {collapsible ? (
            <>
              <span className="hidden lg:inline">Genius Society</span>
              <span className="lg:hidden" title="Genius Society">
                GS
              </span>
            </>
          ) : (
            'Genius Society'
          )}
        </p>
      </div>

      {student ? (
        <div
          className={`rounded-lg border-line ${
            collapsible
              ? 'mx-2 p-0 lg:mx-5 lg:border lg:bg-brand-soft/50 lg:p-3'
              : 'mx-5 border bg-brand-soft/50 p-3'
          }`}
        >
          <div className={`flex items-center gap-3 ${collapsible ? 'justify-center lg:justify-start' : ''}`}>
            <Avatar name={student.name} className="size-10" />
            <div className={`min-w-0 ${collapsible ? 'md:sr-only lg:not-sr-only' : ''}`}>
              <p className="truncate text-sm font-semibold">{student.name}</p>
              <p className="truncate font-mono text-xs text-ink-soft">
                {student.className} · {student.nis}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div aria-hidden className={`h-16 animate-pulse rounded-lg bg-cream-100 ${collapsible ? 'mx-2 lg:mx-5' : 'mx-5'}`} />
      )}

      <nav aria-label="Navigasi utama" className="flex-1">
        <ul className="flex flex-col">
          {studentNav.map(({ label: text, to, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNavigate}
                aria-label={text}
                title={text}
                className={({ isActive }) =>
                  `flex min-h-12 items-center gap-3 border-r-4 px-5 text-sm transition-colors ${center} ${
                    isActive
                      ? 'border-brand-strong bg-brand font-semibold text-ink'
                      : 'border-transparent text-ink-soft hover:bg-cream-100 hover:text-ink'
                  }`
                }
              >
                <Icon aria-hidden className="size-5 shrink-0" />
                <span className={label}>{text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
