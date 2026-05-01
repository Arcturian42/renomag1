import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ARTICLES } from '@/lib/data/blog'
import { formatDateShort } from '@/lib/utils'
import { Plus, Search, Bot, Eye, Clock, Edit } from 'lucide-react'

export default async function AdminContenuPage() {
  const supabase = await createClient()

  const { data: dbArticles } = await supabase
    .from('articles')
    .select('id, title, slug, published, created_at, categories ( name, slug )')
    .order('created_at', { ascending: false })

  const hasDb = dbArticles && dbArticles.length > 0
  const articles = hasDb ? dbArticles : ARTICLES

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contenu</h1>
          <p className="text-slate-500 mt-1">Gestion de l&apos;éditorial — {articles.length} articles</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Chercher un article..."
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm bg-eco-600 hover:bg-eco-700 text-white rounded-lg transition-colors font-medium">
            <Bot className="w-3.5 h-3.5" />
            Générer avec IA
          </button>
          <button className="btn-primary text-sm py-2">
            <Plus className="w-3.5 h-3.5" />
            Nouvel article
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Articles publiés', value: hasDb ? dbArticles.filter((a) => a.published).length : articles.length, color: 'text-slate-900' },
          { label: 'Articles total', value: articles.length, color: 'text-eco-600' },
          { label: 'Non publiés', value: hasDb ? dbArticles.filter((a) => !a.published).length : 0, color: 'text-amber-600' },
          { label: 'Source', value: hasDb ? 'Supabase' : 'Mock', color: hasDb ? 'text-eco-600' : 'text-slate-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-primary-50 border border-primary-200 rounded-xl p-5 mb-6 flex items-center gap-4">
        <Bot className="w-8 h-8 text-primary-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-primary-900">Hermes-Content est actif</p>
          <p className="text-xs text-primary-700 mt-0.5">
            4 articles en cours de génération · 89 dans la file · Prochain déploiement dans 2h
          </p>
        </div>
        <button className="ml-auto flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:text-primary-900">
          Voir la file →
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Titre</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Catégorie</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Publication</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {hasDb ? (
              dbArticles.map((article) => {
                const cat = article.categories as unknown as { name: string } | null
                return (
                  <tr key={article.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900 line-clamp-1">{article.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">/{article.slug}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="badge-primary text-xs">{cat?.name ?? '—'}</span>
                    </td>
                    <td className="px-4 py-4 text-slate-500 text-xs">
                      {new Date(article.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${article.published ? 'bg-eco-100 text-eco-700' : 'bg-amber-100 text-amber-700'}`}>
                        {article.published ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/blog/${article.slug}`} className="p-1.5 rounded hover:bg-slate-100 transition-colors">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                        </Link>
                        <button className="p-1.5 rounded hover:bg-slate-100 transition-colors">
                          <Edit className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              ARTICLES.map((article) => (
                <tr key={article.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900 line-clamp-1">{article.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">/{article.slug}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="badge-primary text-xs">{article.category}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-500 text-xs">
                    {formatDateShort(article.publishedAt)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {article.readTime} min
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/blog/${article.slug}`} className="p-1.5 rounded hover:bg-slate-100 transition-colors">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                      </Link>
                      <button className="p-1.5 rounded hover:bg-slate-100 transition-colors">
                        <Edit className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
