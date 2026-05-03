'use client'

import { useState } from 'react'
import { Upload, File, X, CheckCircle } from 'lucide-react'
import { uploadCertification, deleteCertification } from '@/app/actions/upload'

interface CertificationUploadProps {
  artisanId: string
  existingFiles?: Array<{ name: string; url: string }>
}

export default function CertificationUpload({ artisanId, existingFiles = [] }: CertificationUploadProps) {
  const [files, setFiles] = useState<Array<{ name: string; url: string }>>(existingFiles)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setIsUploading(true)
    setError('')

    try {
      const file = selectedFiles[0]

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Le fichier ne doit pas dépasser 5 MB')
        setIsUploading(false)
        return
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        setError('Seuls les fichiers PDF, JPG et PNG sont acceptés')
        setIsUploading(false)
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('artisanId', artisanId)

      const result = await uploadCertification(formData)

      if (result.success && result.url) {
        setFiles([...files, { name: file.name, url: result.url }])
      } else {
        setError(result.error || 'Erreur lors de l\'upload')
      }
    } catch (err) {
      setError('Une erreur est survenue lors de l\'upload')
      console.error(err)
    } finally {
      setIsUploading(false)
      e.target.value = '' // Reset input
    }
  }

  const handleDelete = async (url: string, name: string) => {
    if (!confirm('Supprimer ce fichier ?')) return

    try {
      const result = await deleteCertification({ url, artisanId })
      if (result.success) {
        setFiles(files.filter(f => f.url !== url))
      } else {
        setError(result.error || 'Erreur lors de la suppression')
      }
    } catch (err) {
      setError('Une erreur est survenue')
      console.error(err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
        <input
          type="file"
          id="certification-upload"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <label htmlFor="certification-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                {isUploading ? 'Upload en cours...' : 'Cliquer pour télécharger'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                PDF, JPG ou PNG (max. 5 MB)
              </p>
            </div>
          </div>
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Fichiers téléchargés</p>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-colors"
            >
              <File className="w-4 h-4 text-primary-600 flex-shrink-0" />
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-sm text-slate-900 hover:text-primary-700 truncate"
              >
                {file.name}
              </a>
              <CheckCircle className="w-4 h-4 text-eco-600 flex-shrink-0" />
              <button
                onClick={() => handleDelete(file.url, file.name)}
                className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
