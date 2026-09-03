import Button from './Button'
import { heroStats } from '../../utils/LandingContent'

export default function Hero() {
  return (
    <section className="px-6 pt-20 pb-16 text-center">
      <div className="mx-auto max-w-3xl">
        <span className="inline-block rounded-full border border-brand-orange/30 bg-brand-orange-light px-4 py-1.5 text-xs font-semibold text-brand-orange">
          Sistem Manajemen Pembelajaran Masa Depan
        </span>

        <h1 className="mt-6 text-4xl font-extrabold leading-tight text-brand-navy sm:text-5xl">
          Revolusi Pembelajaran Digital
          <br />
          <span className="text-brand-orange">GENIUS SOCIETY</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-brand-muted">
          Tingkatkan pengalaman belajar dengan platform terintegrasi. Akses
          materi, kelola tugas, dan pantau perkembangan akademik secara
          real-time dalam lingkungan belajar yang aman dan terukur.
        </p>

        <div className="mt-8">
          <Button>Mulai Belajar</Button>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
        {heroStats.map((stat) => (
          <div
            key={stat.label}
            className="flex w-full items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm sm:w-auto"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange-light text-brand-orange">
              <stat.icon size={20} strokeWidth={2} />
            </span>
            <div className="text-left">
              <p className="text-lg font-bold text-brand-navy">{stat.value}</p>
              <p className="text-xs text-brand-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}