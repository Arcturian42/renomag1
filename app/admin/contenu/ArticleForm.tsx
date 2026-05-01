'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, X } from 'lucide-react'
import { createArticle, updateArticle } from '@/app/actions/data'
import { slugify } from '@/lib/utils'

interface ArticleFormProps {
  mode: 'create' | 'edit'
  article?: {
    id: string
    title: string
    slug: string
    content: string
    excerpt?: string | null
    image?: string | null
    published: boolean
    featured: boolean
    categoryId?: string | null
  }
}

export default function ArticleForm({ mode, article }: ArticleFormProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState(article?.title || '')
  const [slug, setSlug] = useState(article?.slug || '')
  const [content, setContent] = useState(article?.content || '')
  const [excerpt, setExcerpt] = useState(article?.excerpt || '')
  const [image, setImage] = useState(article?.image || '')
  const [published, setPublished] = useState(article?.published || false)
  const [featured, setFeatured] = useState(article?.featured || false)

  function handleTitleChange(val: string) {
    setTitle(val)
    if (mode === 'create') {
      setSlug(slugify(val))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsPending(true)
    setError('')

    try {
      if (mode === 'create') {
        await createArticle({
          title,
          slug,
          content,
          excerpt: excerpt || undefined,
          image: image || undefined,
          published,
          featured,
        })
        setOpen(false)
        router.refresh()
      } else if (article) {
        await updateArticle(article.id, {
          title,
          slug,
          content,
          excerpt: excerpt || undefined,
          image: image || undefined,
          published,
          featured,
        })
        setOpen(false)
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1.5 text-sm transition-colors ${
          mode === 'create'
            ? 'bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-3 py-2 font-medium'
            : 'p-1.5 rounded hover:bg-slate-100'
        }`}
      >
        {mode === 'create' ? (
          <>
            <Plus className="w-3.5 h-3.5" />
            Nouvel article
          </>
        ) : (
          <Edit className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {mode === 'create' ? 'Nouvel article' : 'Modifier l\'article'}
              </h2>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label" htmlFor="article-title">Titre</label>
                <input
                  id="article-title"
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label" htmlFor="article-slug">Slug</label>
                <input
                  id="article-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label" htmlFor="article-excerpt">Extrait</label>
                <input
                  id="article-excerpt"
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label" htmlFor="article-image">Image URL</label>
                <input
                  id="article-image"
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="input-field"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="label" htmlFor="article-content">Contenu</label>
                <textarea
                  id="article-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="input-field resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-700">Publié</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-700">À la une</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-primary px-5 py-2 disabled:opacity-50"
                >
                  {isPending ? 'Enregistrement...' : mode === 'create' ? 'Créer' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
