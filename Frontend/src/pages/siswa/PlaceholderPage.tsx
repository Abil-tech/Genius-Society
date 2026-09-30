import { Card } from '../../components/siswa/ui/Card'

// Halaman tujuan sidebar yang belum dibangun. Hanya menampilkan nama halaman
// agar navigasi bisa diuji; bukan fitur.
export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[clamp(1.75rem,1.2rem+2.4vw,2.75rem)] font-bold leading-tight">{title}</h1>
      <Card className="p-6 text-ink-soft">Halaman {title} belum dibuat.</Card>
    </div>
  )
}
