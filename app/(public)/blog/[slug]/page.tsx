import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleBySlug, getArticles } from '@/app/actions/data'
import { formatDate } from '@/lib/utils'
import { Clock, Calendar, ArrowLeft, Tag, Share2 } from 'lucide-react'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug)
  if (!article) return { title: 'Article non trouvé' }
  return {
    title: article.title,
    description: article.excerpt,
  }
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug)
  if (!article) notFound()

  const allArticles = await getArticles()
  const related = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3)

  return (
    <div className="bg-white min-h-screen">
      {/* Hero image */}
      <div className="relative h-72 md:h-96 bg-slate-200">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 mx-auto max-w-4xl">
          <span className="badge-primary">{article.category}</span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au blog
        </Link>

        <div className="grid lg:grid-cols-[1fr_240px] gap-10">
          {/* Article content */}
          <article>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-5 pb-5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold text-white">
                  {article.author[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{article.author}</p>
                  <p className="text-xs text-slate-400">{article.authorRole}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(article.publishedAt)}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime} min de lecture
              </div>
            </div>

            {/* Excerpt */}
            <p className="mt-6 text-lg text-slate-600 leading-relaxed font-medium">
              {article.excerpt}
            </p>

            {/* Content */}
            <div
              className="mt-6 prose prose-slate prose-sm sm:prose-base max-w-none
                prose-headings:font-display prose-headings:text-slate-900
                prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-3
                prose-h3:text-lg prose-h3:font-semibold
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-strong:text-slate-900
                prose-ul:text-slate-600 prose-li:leading-relaxed
                prose-a:text-primary-700 prose-a:no-underline hover:prose-a:underline"
            >
              {article.content.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={i}>{paragraph.replace('## ', '')}</h2>
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={i}>{paragraph.replace('### ', '')}</h3>
                }
                if (paragraph.startsWith('- ') || paragraph.includes('\n- ')) {
                  const items = paragraph
                    .split('\n')
                    .filter((l) => l.startsWith('- '))
                    .map((l) => l.replace('- ', ''))
                  return (
                    <ul key={i}>
                      {items.map((item, j) => <li key={j}>{item}</li>)}
                    </ul>
                  )
                }
                if (paragraph.startsWith('1. ') || paragraph.includes('\n1. ')) {
                  const items = paragraph
                    .split('\n')
                    .filter((l) => /^\d+\. /.test(l))
                    .map((l) => l.replace(/^\d+\. /, ''))
                  return (
                    <ol key={i}>
                      {items.map((item, j) => <li key={j}>{item}</li>)}
                    </ol>
                  )
                }
                return <p key={i}>{paragraph}</p>
              })}
            </div>

            {/* Tags */}
            <div className="mt-8 pt-5 border-t border-slate-200 flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-slate-400" />
              {article.tags.map((tag) => (
                <span key={tag} className="badge-gray">
                  {tag}
                </span>
              ))}
            </div>

            {/* Share */}
            <div className="mt-6 flex items-center gap-3">
              <Share2 className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">Partager :</span>
              {['Twitter', 'LinkedIn', 'Facebook'].map((net) => (
                <button
                  key={net}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  {net}
                </button>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              {/* CTA */}
              <div className="bg-primary-800 rounded-xl p-5 text-white">
                <p className="text-sm font-semibold mb-2">
                  Prêt à passer à l&apos;action ?
                </p>
                <p className="text-xs text-primary-200 mb-4">
                  Obtenez votre devis gratuit et vos aides calculées.
                </p>
                <Link
                  href="/devis"
                  className="block text-center text-sm font-semibold bg-accent-500 hover:bg-accent-600 text-white rounded-lg px-4 py-2.5 transition-colors"
                >
                  Devis gratuit →
                </Link>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Articles similaires
                  </h3>
                  <div className="space-y-3">
                    {related.map((a) => (
                      <Link
                        key={a.id}
                        href={`/blog/${a.slug}`}
                        className="block text-sm text-slate-700 hover:text-primary-700 transition-colors leading-snug"
                      >
                        → {a.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
