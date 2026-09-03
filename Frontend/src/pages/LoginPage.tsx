import { useState } from 'react'
import { UserRound, Lock, ArrowUpRight } from 'lucide-react'
import LoginInput from '../components/login/LoginInput'
import CornerMark from '../components/login/CornerMark'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: hubungkan ke POST /api/auth/login setelah backend siap
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-brand-orange px-6 py-6">
      {/* Brand mark pojok kiri atas */}
      <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-white">
        <img src="/logo.png" alt="Genius Society" className="h-6 w-6" />
        Genius Society
      </div>

      {/* Card login */}
      <div className="flex flex-1 items-center justify-center py-10">
        <div
          className="relative w-full max-w-md bg-white p-8 shadow-[0_8px_40px_-12px_rgba(15,37,69,0.15)] sm:p-10"
          style={{
            clipPath:
              'polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)',
          }}
        >
          <span className="pointer-events-none absolute right-0 top-0 h-7 w-7 border-b border-l border-brand-orange/30" />

          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-brand-muted">
            Login Page
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-brand-navy">
            Genius Society
          </h1>
          <p className="mt-2 text-sm text-brand-muted">
            Akun dan Password tanyakan kepada walas
          </p>

          <div className="my-6 h-px w-full bg-brand-navy/10" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <LoginInput
              id="username"
              label="Username"
              icon={UserRound}
              placeholder="ENG-000000"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <LoginInput
              id="password"
              label="Password"
              icon={Lock}
              type="password"
              placeholder="••••••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-end">
              <a
                href="#"
                className="font-mono text-xs text-brand-muted underline-offset-2 hover:text-brand-orange hover:underline"
              >
                Lupa Password
              </a>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange py-3.5 font-mono text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand-orange-dark"
            >
              Login
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>

      {/* Penanda sudut bawah, dekoratif sesuai desain */}
      <div className="flex items-center justify-between">
        <CornerMark label="+ 99.00.01" className="!text-white/40" />
        <CornerMark label="+ 99.99.01" className="!text-white/40" />
      </div>
    </div>
  )
}