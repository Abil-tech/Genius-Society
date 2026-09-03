import { useState } from 'react'
import { KeyRound, ShieldAlert, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import LoginInput from '../components/login/LoginInput'
import CornerMark from '../components/login/CornerMark'

export default function AdminLoginPage() {
  const [adminId, setAdminId] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: hubungkan ke POST /api/auth/login setelah backend siap
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Panel kiri: brand + konteks admin, hanya tampil di layar besar */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-navy p-10 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-brand-orange">
          <img src="/logo.png" alt="Genius Society" className="h-6 w-6" />
          Genius Society
        </div>

        <div className="relative">
          <ShieldAlert size={40} strokeWidth={1.5} className="text-brand-orange" />
          <h2 className="mt-6 text-3xl font-extrabold leading-tight">
            Admin Control
            <br />
            Panel
          </h2>
          <p className="mt-3 max-w-xs text-sm text-white/60">
            Akses ini hanya untuk Super Admin dan Admin. Seluruh aktivitas
            tercatat dalam log sistem.
          </p>
        </div>

        <div className="relative flex items-center justify-between">
          <CornerMark label="+ 00.00.01" className="!text-white/25" />
          <CornerMark label="+ 99.99.01" className="!text-white/25" />
        </div>
      </div>

      {/* Panel kanan: form login */}
      <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-16">
        {/* Brand mark, hanya tampil saat panel kiri tersembunyi (mobile) */}
        <div className="mb-8 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-brand-orange lg:hidden">
          <img src="/logo.svg" alt="Genius Society" className="h-6 w-6" />
          Genius Society
        </div>

        <div className="mx-auto w-full max-w-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-red-600">
            <ShieldAlert size={12} strokeWidth={2.5} />
            Admin Access Only
          </span>

          <h1 className="mt-4 text-2xl font-extrabold text-brand-navy sm:text-3xl">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-brand-muted">
            Masuk menggunakan kredensial administrator sekolah.
          </p>

          <div className="my-6 h-px w-full bg-brand-navy/10" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <LoginInput
              id="adminId"
              label="Admin ID"
              icon={ShieldAlert}
              placeholder="ADM-000000"
              autoComplete="username"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
            />

            <LoginInput
              id="password"
              label="Password"
              icon={KeyRound}
              type="password"
              placeholder="••••••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-end">
              <a
                href="#"
                className="font-mono text-xs text-brand-muted underline-offset-2 hover:text-brand-navy hover:underline"
              >
                Lupa Password
              </a>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-navy py-3.5 font-mono text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand-navy-light"
            >
              Masuk sebagai Admin
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-brand-muted">
            Bukan Admin?{' '}
            <Link
              to="/login"
              className="font-semibold text-brand-orange hover:underline">
              Login sebagai Staff
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}