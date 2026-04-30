'use client'

import { Download } from 'lucide-react'

function escapeCsv(value: any): string {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function generateCsv<T extends Record<string, any>>(
  data: T[],
  columns: { key: string; header: string }[]
): string {
  const header = columns.map((c) => escapeCsv(c.header)).join(',')
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = c.key.split('.').reduce((o, k) => o?.[k], row)
        return escapeCsv(val)
      })
      .join(',')
  )
  return [header, ...rows].join('\n')
}

type ExportButtonProps<T> = {
  data: T[]
  columns: { key: string; header: string }[]
  filename?: string
}

export default function ExportButton<T extends Record<string, any>>({
  data,
  columns,
  filename = 'export.csv',
}: ExportButtonProps<T>) {
  function handleExport() {
    const csv = generateCsv(data, columns)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all"
    >
      <Download className="w-4 h-4" />
      Exporter CSV
    </button>
  )
}
