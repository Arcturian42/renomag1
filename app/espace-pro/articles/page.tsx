import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getArtisanArticles } from '@/app/actions/articles'
import { FileText, Plus, Eye } from 'lucide-react'

export default async function ArticlesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { artisan: true },
  })

  if (!dbUser || dbUser.role !== 'ARTISAN' || !dbUser.artisan) {
    redirect('/espace-proprietaire')
  }

  const articles = await getArtisanArticles(dbUser.artisan.id)

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mes articles</h1>
          <p className="text-slate-500 mt-1">Gérez vos publications sur le blog</p>
        </div>
        <Link
          href="/espace-pro/articles/nouveau"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl px-4 py-2.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvel article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Aucun article</h3>
          <p className="text-xs text-slate-500 mb-4">
            Publiez votre premier article pour améliorer votre visibilité.
          </p>
          <Link
            href="/espace-pro/articles/nouveau"
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-medium"
          >
            <Plus className="w-4 h-4" />
            Créer un article
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between"
            >
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 truncate">{article.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {article.category?.name || 'Sans catégorie'} ·{' '}
                  {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <span
                  className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                    article.published
                      ? 'bg-eco-100 text-eco-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {article.published ? 'Publié' : 'Brouillon'}
                </span>
                <Link
                  href={`/blog/${article.slug}`}
                  className="text-slate-400 hover:text-primary-600 transition-colors"
                  target="_blank"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
