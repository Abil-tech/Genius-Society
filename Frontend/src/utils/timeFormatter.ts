// formatTimeRelative: Format waktu relatif Bahasa Indonesia ("12 menit lalu",
// "1 jam lalu", "3 hari lalu", dsb). Dipakai di dashboard & activity log
// untuk menampilkan CreatedAt/SubmittedAt yang diterima dari backend sebagai
// timestamp mentah.
//
// Contoh:
// - formatTimeRelative(new Date(Date.now() - 5*60*1000)) → "5 menit lalu"
// - formatTimeRelative(new Date(Date.now() - 2*60*60*1000)) → "2 jam lalu"
// - formatTimeRelative(new Date(Date.now() - 7*24*60*60*1000)) → "7 hari lalu"
export function formatTimeRelative(date: Date | string): string {
  const now = new Date()
  const targetDate = typeof date === 'string' ? new Date(date) : date

  if (isNaN(targetDate.getTime())) {
    return 'tanggal tidak valid'
  }

  const diffMs = now.getTime() - targetDate.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)

  if (diffSec < 60) {
    return 'baru saja'
  }
  if (diffMin < 60) {
    return diffMin === 1 ? '1 menit lalu' : `${diffMin} menit lalu`
  }
  if (diffHour < 24) {
    return diffHour === 1 ? '1 jam lalu' : `${diffHour} jam lalu`
  }
  if (diffDay < 7) {
    return diffDay === 1 ? '1 hari lalu' : `${diffDay} hari lalu`
  }
  if (diffWeek < 4) {
    return diffWeek === 1 ? '1 minggu lalu' : `${diffWeek} minggu lalu`
  }
  if (diffMonth < 12) {
    return diffMonth === 1 ? '1 bulan lalu' : `${diffMonth} bulan lalu`
  }

  const years = Math.floor(diffMonth / 12)
  return years === 1 ? '1 tahun lalu' : `${years} tahun lalu`
}

// formatDate: Format date ke "DD Mon YYYY" (contoh: "21 Sep 2026")
// Dipakai jika backend kirim date yang perlu ditampilkan lengkap (bukan
// relatif) dalam UI.
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}