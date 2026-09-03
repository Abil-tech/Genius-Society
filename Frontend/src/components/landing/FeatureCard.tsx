import type { FeatureItem } from '../../types/Landing'

export default function FeatureCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
}: FeatureItem) {
  return (
    <div className="rounded-2xl bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
      >
        <Icon size={20} strokeWidth={2} />
      </span>
      <h3 className="mt-4 text-[15px] font-bold text-brand-navy">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-brand-muted">
        {description}
      </p>
    </div>
  )
}