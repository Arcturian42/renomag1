import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { createArticle } from '@/app/actions/articles'

async function handleCreateArticle(formData: FormData) {
  'use server'
  await createArticle(formData)
}
import { ArrowLeft, FileText } from 'lucide-react'

export default async function NewArticlePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { artisan: { include: { subscription: true } } },
  })

  if (!dbUser || dbUser.role !== 'ARTISAN' || !dbUser.artisan) {
    redirect('/espace-proprietaire')
  }

  const artisan = dbUser.artisan
  const subscription = artisan.subscription
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const articlesThisMonth = await prisma.article.count({
    where: { authorId: artisan.id, createdAt: { gte: startOfMonth } },
  })
  const quota = subscription?.articlesQuota ?? 1
  const canPublish = articlesThisMonth < quota

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-6">
        <Link
          href="/espace-pro/articles"
          className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour aux articles
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Nouvel article</h1>
        <p className="text-slate-500 mt-1">
          Quota ce mois : {articlesThisMonth}/{quota}
        </p>
      </div>

      {!canPublish && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          Vous avez atteint votre quota d&apos;articles ce mois ({quota}).
        </div>
      )}

      <form action={handleCreateArticle} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div>
          <label htmlFor="title" className="label">Titre</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            disabled={!canPublish}
            placeholder="Titre de votre article"
            className="input-field disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="label">Résumé</label>
          <input
            id="excerpt"
            name="excerpt"
            type="text"
            disabled={!canPublish}
            placeholder="Court résumé pour les listes d'articles"
            className="input-field disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="label">Catégorie</label>
          <select
            id="categoryId"
            name="categoryId"
            disabled={!canPublish}
            className="input-field disabled:opacity-50"
          >
            <option value="">Sans catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="content" className="label">Contenu</label>
          <textarea
            id="content"
            name="content"
            rows={12}
            required
            disabled={!canPublish}
            placeholder="Rédigez votre article ici..."
            className="input-field resize-none disabled:opacity-50"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            <FileText className="w-3.5 h-3.5 inline mr-1" />
            L&apos;article sera publié immédiatement sur le blog.
          </p>
          <button
            type="submit"
            disabled={!canPublish}
            className="btn-primary disabled:opacity-50"
          >
            Publier
          </button>
        </div>
      </form>
    </div>
  )
}
