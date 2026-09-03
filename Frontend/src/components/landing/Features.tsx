import FeatureCard from './FeatureCard'
import { features } from '../../utils/LandingContent'

export default function Features() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-2xl font-extrabold text-brand-navy sm:text-3xl">
          Keunggulan Platform LMS Kami
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-brand-muted">
          Dirancang khusus untuk mendukung kegiatan belajar mengajar yang
          efektif, interaktif, dan terukur.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}