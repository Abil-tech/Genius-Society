import { useRef, useState } from 'react'
import { UploadCloud, Download, CheckCircle2, AlertTriangle } from 'lucide-react'
import Modal from '../../../components/admin/Modal'
import { parseCsv, toCsv, downloadCsv } from '../../../utils/Csv'
import type { Student, Gender } from '../../../types/Student'

interface ImportStudentModalProps {
  existingStudents: Student[]
  classOptions: string[]
  onClose: () => void
  onImport: (students: Student[]) => void
}

interface PreviewRow {
  rowNumber: number
  values: Partial<Student>
  errors: string[]
}

const TEMPLATE_HEADERS = [
  'nama',
  'nis',
  'nisn',
  'nik',
  'jenis_kelamin',
  'tempat_lahir',
  'tanggal_lahir',
  'email',
  'telepon',
  'alamat',
  'kelas',
  'jurusan',
  'tingkat',
  'tahun_ajaran',
  'username',
]

export default function ImportStudentModal({
  existingStudents,
  classOptions,
  onClose,
  onImport,
}: ImportStudentModalProps) {
  const [step, setStep] = useState<'upload' | 'preview'>('upload')
  const [preview, setPreview] = useState<PreviewRow[]>([])
  const [fileName, setFileName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleDownloadTemplate() {
    const csv = toCsv(TEMPLATE_HEADERS, [
      [
        'Ahmad Fauzan',
        '001245',
        '0098765432',
        '3273010101060001',
        'L',
        'Bandung',
        '12 Maret 2009',
        'ahmad.fauzan@student.sch.id',
        '081234567801',
        'Jl. Merdeka No. 12, Bandung',
        '11 PPLG 1',
        'PPLG',
        '11',
        '2026/2027',
        'ahmad.fauzan',
      ],
    ])
    downloadCsv('template-import-siswa.csv', csv)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result)
      const rows = parseCsv(text)
      const [header, ...dataRows] = rows
      const colIndex = (name: string) =>
        header.findIndex((h) => h.toLowerCase().trim() === name)

      const seenNis = new Set(existingStudents.map((s) => s.nis))
      const seenNisn = new Set(existingStudents.map((s) => s.nisn))

      const result: PreviewRow[] = dataRows.map((row, idx) => {
        const get = (name: string) => row[colIndex(name)]?.trim() ?? ''

        const values: Partial<Student> = {
          name: get('nama'),
          nis: get('nis'),
          nisn: get('nisn'),
          nik: get('nik'),
          gender: (get('jenis_kelamin').toUpperCase() === 'P' ? 'P' : 'L') as Gender,
          birthPlace: get('tempat_lahir'),
          birthDate: get('tanggal_lahir'),
          email: get('email'),
          phone: get('telepon'),
          address: get('alamat'),
          className: get('kelas'),
          major: get('jurusan'),
          grade: Number(get('tingkat')) || 10,
          academicYear: get('tahun_ajaran'),
          username: get('username') || get('email').split('@')[0],
        }

        const errors: string[] = []
        if (!values.name) errors.push('Nama wajib diisi')
        if (!values.nis) {
          errors.push('NIS wajib diisi')
        } else if (seenNis.has(values.nis)) {
          errors.push('NIS sudah digunakan')
        }
        if (!/^\d{10}$/.test(values.nisn ?? '')) {
          errors.push('NISN tidak valid (harus 10 digit)')
        } else if (seenNisn.has(values.nisn ?? '')) {
          errors.push('NISN sudah digunakan')
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email ?? '')) {
          errors.push('Email tidak valid')
        }
        if (!values.className || !classOptions.includes(values.className)) {
          errors.push('Kelas tidak ditemukan')
        }

        // Cegah duplikat NIS/NISN antar baris dalam file yang sama
        if (values.nis) seenNis.add(values.nis)
        if (values.nisn) seenNisn.add(values.nisn)

        return { rowNumber: idx + 2, values, errors }
      })

      setPreview(result)
      setStep('preview')
    }
    reader.readAsText(file)
  }

  const validRows = preview.filter((r) => r.errors.length === 0)
  const invalidRows = preview.filter((r) => r.errors.length > 0)

  function handleConfirmImport() {
    setIsProcessing(true)
    // TODO: kirim validRows ke POST /api/students/import, atau kirim file
    // asli ke backend kalau validasi utama dilakukan di server.
    setTimeout(() => {
      const newStudents: Student[] = validRows.map((row, idx) => ({
        id: `std-import-${Date.now()}-${idx}`,
        status: 'aktif',
        homeroomTeacher: '-',
        lastLogin: '-',
        createdAt: new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        ...row.values,
      }) as Student)

      setIsProcessing(false)
      onImport(newStudents)
    }, 500)
  }

  return (
    <Modal
      title="Import Siswa"
      onClose={onClose}
      size="lg"
      footer={
        step === 'upload' ? (
          <button
            onClick={onClose}
            className="rounded-lg border border-brand-navy/10 px-4 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-bg"
          >
            Tutup
          </button>
        ) : (
          <>
            <button
              onClick={() => setStep('upload')}
              className="rounded-lg border border-brand-navy/10 px-4 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-bg"
            >
              Pilih File Lain
            </button>
            <button
              onClick={handleConfirmImport}
              disabled={validRows.length === 0 || isProcessing}
              className="rounded-lg bg-brand-orange px-4 py-2 text-xs font-semibold text-white hover:bg-brand-orange-dark disabled:opacity-60"
            >
              {isProcessing
                ? 'Memproses...'
                : `Import ${validRows.length} Data`}
            </button>
          </>
        )
      }
    >
      {step === 'upload' ? (
        <div className="space-y-4">
          <button
            onClick={handleDownloadTemplate}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-navy/10 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-bg"
          >
            <Download size={15} strokeWidth={2} />
            Download Template CSV
          </button>

          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-navy/15 py-10 text-center hover:border-brand-orange">
            <UploadCloud size={28} strokeWidth={1.5} className="text-brand-orange" />
            <p className="text-sm font-semibold text-brand-navy">
              Klik untuk upload file CSV
            </p>
            <p className="text-xs text-brand-muted">
              Gunakan template di atas supaya kolom terbaca dengan benar
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-brand-muted">
            File: <span className="font-semibold text-brand-navy">{fileName}</span>
          </p>

          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-status-success-bg px-3 py-2 text-sm text-status-success">
              <CheckCircle2 size={16} strokeWidth={2} />
              {validRows.length} data berhasil divalidasi
            </div>
            {invalidRows.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-status-danger-bg px-3 py-2 text-sm text-status-danger">
                <AlertTriangle size={16} strokeWidth={2} />
                {invalidRows.length} data memiliki kesalahan
              </div>
            )}
          </div>

          {invalidRows.length > 0 && (
            <div className="max-h-64 overflow-y-auto rounded-lg border border-brand-navy/5">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-brand-bg">
                  <tr className="text-[10px] font-mono uppercase tracking-wide text-brand-muted">
                    <th className="px-3 py-2 font-medium">Baris</th>
                    <th className="px-3 py-2 font-medium">Nama</th>
                    <th className="px-3 py-2 font-medium">Kesalahan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-navy/5">
                  {invalidRows.map((row) => (
                    <tr key={row.rowNumber}>
                      <td className="px-3 py-2 text-brand-muted">{row.rowNumber}</td>
                      <td className="px-3 py-2 text-brand-navy">
                        {row.values.name || '-'}
                      </td>
                      <td className="px-3 py-2 text-status-danger">
                        {row.errors.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}