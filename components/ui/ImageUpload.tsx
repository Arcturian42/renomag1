'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onUpload: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>
  className?: string
}

export default function ImageUpload({ value, onChange, onUpload, className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)
      setIsUploading(true)

      if (!file.type.startsWith('image/')) {
        setError('Le fichier doit être une image.')
        setIsUploading(false)
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5 Mo.')
        setIsUploading(false)
        return
      }

      const result = await onUpload(file)
      if (result.success && result.url) {
        onChange(result.url)
      } else {
        setError(result.error ?? 'Échec de l\'upload.')
      }

      setIsUploading(false)
    },
    [onChange, onUpload]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  return (
    <div className={cn('space-y-2', className)}>
      {value ? (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200">
          <Image src={value} alt="Preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-slate-900/60 text-white flex items-center justify-center hover:bg-slate-900/80 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={cn(
            'relative w-32 h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer',
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50'
          )}
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
          ) : (
            <>
              <Upload className="w-6 h-6 text-slate-400" />
              <span className="text-[10px] text-slate-500 text-center px-2">
                Glisser ou cliquer
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={onFileSelect}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={isUploading}
          />
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
