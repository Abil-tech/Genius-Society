import Logo from './Logo'
import Button from './Button'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />
        <Button size="sm">Mulai Belajar</Button>
      </div>
    </header>
  )
}