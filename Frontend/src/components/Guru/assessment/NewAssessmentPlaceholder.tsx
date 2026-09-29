import { CheckCircle2 } from 'lucide-react'

export default function NewAssessmentPlaceholder({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[220px] flex-col items-center justify-center rounded-md border-2 border-dashed border-[#E6CDB8] p-6 text-center hover:bg-[#FFF3EA]"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#CFC3B8] text-[#5C5148]">
        <CheckCircle2 className="h-5 w-5" />
      </span>
      <p className="mt-4 font-mono text-[10px] uppercase text-[#7A6A5C]">System_Standby</p>
      <p className="mt-1 text-base font-bold text-[#2B211A]">Queue New Assessment</p>
      <p className="mt-2 max-w-[200px] text-sm text-[#7A6A5C]">
        Define parameters to initialize a new evaluative session.
      </p>
    </button>
  )
}