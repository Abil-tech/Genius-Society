interface Props {
  percent: number
  segments?: number
}

export default function SegmentedBar({ percent, segments = 10 }: Props) {
  const filled = Math.floor((Math.min(100, Math.max(0, percent)) / 100) * segments)
  return (
    <div className="mt-2 flex gap-1" aria-hidden>
      {Array.from({ length: segments }).map((_, i) => (
        <span
          key={i}
          className={`h-1 flex-1 rounded-full ${i < filled ? 'bg-[#FF9500]' : 'bg-[#EFE3D8]'}`}
        />
      ))}
    </div>
  )
}