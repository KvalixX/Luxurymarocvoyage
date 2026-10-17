import Image from 'next/image';
import { Link } from '@/lib/i18n/navigation';
import { Article } from '@/lib/queries/articles';
import { getTranslations } from 'next-intl/server';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

interface LatestArticlesProps {
  articles: Article[];
  locale: string;
}

export default async function LatestArticles({
  articles,
  locale,
}: LatestArticlesProps) {
  const t = await getTranslations({ locale, namespace: 'sections' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-[#FDFBF7] to-[#FAF5EE]/70 border-t border-[#F0E6D8]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <div className="section-eyebrow">
              <BookOpen className="w-3 h-3 text-[#DF6951]" />
              <span>
                {locale === 'fr'
                  ? 'Carnet de Voyage'
                  : locale === 'es'
                  ? 'Cuaderno de Viaje'
                  : 'Travel Journal'}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#181E4B] tracking-tight leading-tight">
              {t('blogTitle')}
            </h2>
            <p className="mt-2 text-slate-500 text-xs sm:text-[14px] leading-relaxed">
              {t('blogSub')}
            </p>
          </div>

          <Link
            href="/blog"
            className="btn-outline shrink-0 self-start md:self-auto"
          >
            <span>{tCommon('viewAllArticles')}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((article) => {
            const defaultImage =
              'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80';
            const imageUrl =
              article.imageUrl && article.imageUrl.startsWith('http')
                ? article.imageUrl
                : defaultImage;

            return (
              <article
                key={article.id}
                className="group flex flex-col rounded-2xl bg-white overflow-hidden border border-[#F0E6D8]/80 shadow-[0_2px_12px_rgba(26,15,10,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(223,105,81,0.16)] hover:border-terracotta-300/60 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={imageUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {article.category && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-morocco-dark/85 text-sand-200 backdrop-blur-md border border-white/10 shadow-xs">
                        {article.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-6 flex flex-1 flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    {article.date && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#DF6951]" />
                        <span>{new Date(article.date).toLocaleDateString(locale)}</span>
                      </div>
                    )}

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#181E4B] group-hover:text-[#DF6951] transition-colors line-clamp-2">
                      <Link href={`/blog/${article.slug}` as any}>
                        {article.title}
                      </Link>
                    </h3>

                    {article.description && (
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {article.description.replace(/<[^>]*>?/gm, '')}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      Guide Voyage Maroc
                    </span>

                    <Link
                      href={`/blog/${article.slug}` as any}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#DF6951] hover:text-[#c94e38] transition-colors"
                    >
                      <span>{tCommon('readArticle')}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
