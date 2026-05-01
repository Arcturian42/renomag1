import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedArticles } from '@/lib/data/db'
import { formatDateShort } from '@/lib/utils'
import { Clock, ArrowRight } from 'lucide-react'

export default async function FeaturedArticles() {
  const featured = await getFeaturedArticles()

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="badge-primary mb-3">Blog & Guides</div>
            <h2 className="text-2xl font-bold text-slate-900">
              Tout savoir sur la rénovation énergétique
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Guides pratiques, actualités des aides et conseils d&apos;experts
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary-700 hover:text-primary-900 transition-colors"
          >
            Tous les articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((article, idx) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className={`group rounded-xl overflow-hidden border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-200 ${idx === 0 ? 'md:col-span-2 flex flex-col md:flex-row' : 'flex flex-col'}`}
            >
              <div
                className={`relative overflow-hidden bg-slate-100 ${idx === 0 ? 'md:w-64 h-48 md:h-auto flex-shrink-0' : 'h-44'}`}
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute top-3 left-3">
                  <span className="badge-primary text-xs">{article.category}</span>
                </div>
              </div>
              <div className="flex flex-col justify-between p-5 flex-1">
                <div>
                  <h3
                    className={`font-semibold text-slate-900 group-hover:text-primary-700 transition-colors leading-snug ${idx === 0 ? 'text-lg' : 'text-sm'}`}
                  >
                    {article.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>{formatDateShort(article.publishedAt)}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime} min</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
