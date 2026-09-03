import Logo from './Logo'
import Button from './Button'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-brand-orange">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo variant="light" />
        <Button size="sm" variant="primary" className="border border-white/40">
          Mulai Belajar
        </Button>
      </div>
    </header>
  )
}