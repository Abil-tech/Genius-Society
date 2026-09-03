interface LogoProps {
  variant?: 'dark' | 'light'
}

export default function Logo({ variant = 'dark' }: LogoProps) {
  const textColor = variant === 'dark' ? 'text-brand-navy' : 'text-white'

  return (
    <div className="flex items-center gap-2">
      <img src="/logo.png" alt="Genius Society" className="h-7 w-7" />
      <span className={`text-[15px] font-bold ${textColor}`}>Genius Society</span>
    </div>
  )
}