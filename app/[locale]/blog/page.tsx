import type { Metadata } from 'next';
import { localizedAlternates } from '@/lib/seo/urls';
import Image from 'next/image';
import { getArticles } from '@/lib/queries/articles';
import { Link } from '@/lib/i18n/navigation';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    fr: 'Journal de Voyage au Maroc | Conseils, Guides & Astuces d’Experts',
    en: 'Morocco Travel Blog | Guides, Tips & Insider Packing Advice',
    es: 'Diario de Viaje a Marruecos | Consejos, Guías y Secretos Locales',
  };

  const descriptions: Record<string, string> = {
    fr: 'Consultez nos articles et guides de voyage pour préparer votre séjour au Maroc : valise idéale, nuits en bivouac dans le Sahara, culture et traditions berbères.',
    en: 'Read our expert Moroccan travel journal: essential packing list, bivouac desert camping tips, traveling with pets, and authentic cultural advice.',
    es: 'Descubra nuestro blog con las mejores recomendaciones para viajar a Marruecos: qué meter en la maleta, acampada en el desierto y cultura bereber.',
  };


  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    alternates: localizedAlternates(locale, '/blog'),
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const articles = await getArticles(locale);

  const breadcrumbs = [
    {
      label:
        locale === 'en'
          ? 'Travel Blog'
          : locale === 'es'
          ? 'Diario de Viaje'
          : 'Journal de Voyage',
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-morocco-cream min-h-screen">
      <Breadcrumbs items={breadcrumbs} locale={locale} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-100 text-sand-800 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5 text-sand-600" />
            <span>Guides & Secrets d’Initiés</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-morocco-dark tracking-tight">
            Journal de Voyage au Maroc
          </h1>
          <p className="mt-3 text-sand-800 text-sm sm:text-base leading-relaxed">
            Tout ce qu&apos;il faut savoir pour voyager l&apos;esprit serein. Conseils d&apos;experts locaux, us et coutumes, recommandations de valise et récits d&apos;aventures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                className="group flex flex-col rounded-3xl bg-white overflow-hidden luxury-card border border-sand-200/60"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-morocco-charcoal">
                  <Image
                    src={imageUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-morocco-dark/70 via-transparent to-transparent" />

                  {article.category && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-morocco-dark/80 text-sand-300 backdrop-blur-md border border-white/10">
                        {article.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-1 flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    {article.date && (
                      <div className="flex items-center gap-1.5 text-xs text-sand-700">
                        <Calendar className="w-3.5 h-3.5 text-terracotta-500" />
                        <span>
                          {new Date(article.date).toLocaleDateString(locale)}
                        </span>
                      </div>
                    )}

                    <h2 className="font-serif text-xl font-bold text-morocco-dark group-hover:text-terracotta-600 transition-colors line-clamp-2">
                      <Link href={`/blog/${article.slug}` as any}>
                        {article.title}
                      </Link>
                    </h2>

                    {article.description && (
                      <p className="text-xs text-sand-800 line-clamp-3 leading-relaxed">
                        {article.description.replace(/<[^>]*>?/gm, '')}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-sand-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-sand-800">
                      Conseil Voyage
                    </span>

                    <Link
                      href={`/blog/${article.slug}` as any}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-terracotta-600 group-hover:text-terracotta-700"
                    >
                      <span>Lire l&apos;article</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
