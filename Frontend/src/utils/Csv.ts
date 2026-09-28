/**
 * Parser & generator CSV minimal, tanpa dependency eksternal.
 * Sengaja tidak pakai library "xlsx" (SheetJS) karena versi npm-nya
 * punya vulnerability high-severity (prototype pollution & ReDoS)
 * yang belum ada fix resmi per audit terakhir. CSV cukup untuk
 * kebutuhan import/export tabular sederhana dan bisa dibuka langsung
 * di Excel/Google Sheets.
 */

export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  const lines = text.replace(/\r\n/g, '\n').split('\n').filter((l) => l.trim() !== '')

  for (const line of lines) {
    const cells: string[] = []
    let current = ''
    let insideQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        insideQuotes = !insideQuotes
      } else if (char === ',' && !insideQuotes) {
        cells.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    cells.push(current.trim())
    rows.push(cells)
  }

  return rows
}

export function toCsv(headers: string[], rows: (string | number)[][]): string {
  const escape = (value: string | number) => {
    const str = String(value)
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
  }

  const lines = [headers.map(escape).join(',')]
  for (const row of rows) {
    lines.push(row.map(escape).join(','))
  }
  return lines.join('\n')
}

export function downloadCsv(filename: string, csvContent: string) {
  // BOM UTF-8 supaya karakter non-ASCII (misal huruf ber-aksen) tetap
  // terbaca benar saat dibuka di Excel.
  const blob = new Blob(['\ufeff' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}