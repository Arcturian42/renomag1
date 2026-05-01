export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getAllArticles, deleteArticle } from '@/app/actions/data'
import { formatDateShort, slugify } from '@/lib/utils'
import { Plus, Eye, Trash2, Edit } from 'lucide-react'
import ArticleForm from './ArticleForm'

async function handleDeleteArticle(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  if (id) await deleteArticle(id)
}

export default async function AdminContenuPage() {
  const articles = await getAllArticles()

  const publishedCount = articles.filter((a) => a.published).length

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contenu</h1>
          <p className="text-slate-500 mt-1">{articles.length} articles — {publishedCount} publiés</p>
        </div>
        <ArticleForm mode="create" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Articles publiés', value: publishedCount, color: 'text-slate-900' },
          { label: 'Brouillons', value: articles.length - publishedCount, color: 'text-amber-600' },
          { label: 'À la une', value: articles.filter((a) => a.featured).length, color: 'text-primary-600' },
          { label: 'Total', value: articles.length, color: 'text-eco-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Articles table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Publication
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr
                key={article.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-900 line-clamp-1">{article.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">/{article.slug}</p>
                </td>
                <td className="px-4 py-4">
                  <span className="badge-primary text-xs">{article.category?.name || 'Non classé'}</span>
                </td>
                <td className="px-4 py-4 text-slate-500 text-xs">
                  {formatDateShort(article.createdAt)}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                      article.published ? 'badge-rge' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {article.published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="p-1.5 rounded hover:bg-slate-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                    <ArticleForm mode="edit" article={article} />
                    <form action={handleDeleteArticle}>
                      <input type="hidden" name="id" value={article.id} />
                      <button
                        type="submit"
                        className="p-1.5 rounded hover:bg-red-50 transition-colors"
                        onClick={(e) => {
                          if (!confirm('Supprimer cet article ?')) e.preventDefault()
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-500">
                  Aucun article. Créez votre premier article !
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
