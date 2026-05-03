'use client'

import { useState } from 'react'
import { Upload, File, X, Image as ImageIcon, FileText, Download } from 'lucide-react'
import { uploadProjectDocument, deleteProjectDocument } from '@/app/actions/upload'

interface ProjectDocument {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  createdAt: string
}

interface ProjectDocumentUploadProps {
  userId: string
  documents: ProjectDocument[]
}

export default function ProjectDocumentUpload({ userId, documents: initialDocuments }: ProjectDocumentUploadProps) {
  const [documents, setDocuments] = useState<ProjectDocument[]>(initialDocuments)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setIsUploading(true)
    setError('')

    try {
      const file = selectedFiles[0]

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Le fichier ne doit pas dépasser 10 MB')
        setIsUploading(false)
        return
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/gif',
        'image/webp',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]

      if (!allowedTypes.includes(file.type)) {
        setError('Type de fichier non supporté. Utilisez PDF, images ou documents Word.')
        setIsUploading(false)
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', userId)

      const result = await uploadProjectDocument(formData)

      if (result.success && result.url && result.fileName) {
        // Reload page to get updated documents
        window.location.reload()
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

  const handleDelete = async (documentId: string) => {
    if (!confirm('Supprimer ce document ?')) return

    try {
      const result = await deleteProjectDocument({ documentId, userId })
      if (result.success) {
        setDocuments(documents.filter(d => d.id !== documentId))
      } else {
        setError(result.error || 'Erreur lors de la suppression')
      }
    } catch (err) {
      setError('Une erreur est survenue')
      console.error(err)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-primary-600" />
    return <FileText className="w-5 h-5 text-slate-600" />
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
        <input
          type="file"
          id="project-document-upload"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <label htmlFor="project-document-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                {isUploading ? 'Upload en cours...' : 'Cliquer pour télécharger'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Photos, plans, PDF, documents (max. 10 MB)
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

      {documents.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Documents téléchargés ({documents.length})</p>
          <div className="grid md:grid-cols-2 gap-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-colors border border-slate-200"
              >
                {getFileIcon(doc.fileType)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{doc.fileName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500">{formatFileSize(doc.fileSize)}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">
                      {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                    title="Télécharger"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                    title="Supprimer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {documents.length === 0 && !error && (
        <div className="text-center py-6">
          <File className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Aucun document téléchargé</p>
          <p className="text-xs text-slate-400 mt-1">
            Ajoutez des photos de votre projet, plans, permis ou devis
          </p>
        </div>
      )}
    </div>
  )
}
