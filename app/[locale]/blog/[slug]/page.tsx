import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getArticleBySlug, getArticleSlugs, getLatestArticles } from '@/lib/queries/articles';
import { Link } from '@/lib/i18n/navigation';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { Calendar, User, ArrowLeft, Sparkles, Share2 } from 'lucide-react';

interface ArticleDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  const locales = ['fr', 'en', 'es'];

  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const item of slugs) {
      if (item.slug) {
        params.push({ locale, slug: item.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, locale);

  if (!article) return { title: 'Article Non Trouvé' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.luxurymarocvoyage.com';
  const canonicalUrl = `${siteUrl}/${locale}/blog/${slug}`;
  const cleanDescription = article.description
    ?.replace(/<[^>]*>?/gm, '')
    .slice(0, 160);

  return {
    title: `${article.title} | Journal Luxurymarocvoyage`,
    description: cleanDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: `${siteUrl}/fr/blog/${slug}`,
        en: `${siteUrl}/en/blog/${slug}`,
        es: `${siteUrl}/es/blog/${slug}`,
      },
    },
    openGraph: {
      title: article.title,
      description: cleanDescription,
      url: canonicalUrl,
      type: 'article',
      publishedTime: article.date,
      images: article.imageUrl ? [{ url: article.imageUrl }] : [],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  const recentArticles = await getLatestArticles(locale, 3);
  const otherArticles = recentArticles.filter((a) => a.slug !== article.slug).slice(0, 2);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.luxurymarocvoyage.com';

  const defaultImage =
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85';
  const imageUrl =
    article.imageUrl && article.imageUrl.startsWith('http')
      ? article.imageUrl
      : defaultImage;

  // BlogPosting Schema.org JSON-LD
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    image: [imageUrl],
    datePublished: article.date,
    dateModified: article.updatedAt || article.date,
    author: {
      '@type': 'Organization',
      name: 'Luxurymarocvoyage',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Luxurymarocvoyage',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    description: article.description?.replace(/<[^>]*>?/gm, '').slice(0, 160),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/${locale}/blog/${article.slug}`,
    },
  };

  const breadcrumbs = [
    {
      label:
        locale === 'en'
          ? 'Travel Blog'
          : locale === 'es'
          ? 'Diario de Viaje'
          : 'Journal de Voyage',
      href: '/blog',
    },
    { label: article.title },
  ];

  return (
    <div className="pt-24 pb-20 bg-morocco-cream min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <Breadcrumbs items={breadcrumbs} locale={locale} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {article.category && (
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-terracotta-50 text-terracotta-700">
                {article.category}
              </span>
            )}

            {article.date && (
              <div className="flex items-center gap-1.5 text-xs text-sand-700">
                <Calendar className="w-3.5 h-3.5 text-terracotta-500" />
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs text-sand-700">
              <User className="w-3.5 h-3.5 text-sand-500" />
              <span>Par l&apos;équipe Luxurymarocvoyage</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-morocco-dark tracking-tight leading-[1.2]">
            {article.title}
          </h1>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden mb-12 shadow-md">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="rounded-3xl bg-white border border-sand-200 p-8 sm:p-12 shadow-sm">
          <div
            className="prose prose-lg max-w-none text-sand-900 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{
              __html: article.description.replace(/\n\n/g, '<br /><br />'),
            }}
          />

          {/* Custom CTA Box inside Article */}
          <div className="mt-12 p-8 rounded-2xl bg-morocco-warm/80 border border-sand-300/80 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 block mb-1">
                Inspiré par cette lecture ?
              </span>
              <h4 className="font-serif text-xl font-bold text-morocco-dark">
                Planifiez Votre Séjour Sur-Mesure au Maroc
              </h4>
              <p className="text-xs text-sand-800 mt-1">
                Nos conseillers conçoivent votre itinéraire idéal avec hébergement en riads et chauffeur privé.
              </p>
            </div>

            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shrink-0 transition-all text-center"
            >
              Demander un Devis
            </Link>
          </div>
        </div>

        {/* Other articles */}
        {otherArticles.length > 0 && (
          <div className="mt-16 pt-10 border-t border-sand-200">
            <h3 className="font-serif text-2xl font-bold text-morocco-dark mb-6">
              À Lire Également
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherArticles.map((other) => (
                <Link
                  key={other.id}
                  href={`/blog/${other.slug}` as any}
                  className="group flex flex-col gap-2 rounded-2xl bg-white p-5 border border-sand-200 hover:border-terracotta-300 transition-all shadow-sm"
                >
                  <span className="text-[11px] font-semibold text-terracotta-600 uppercase">
                    {other.category || 'Guide Maroc'}
                  </span>
                  <h4 className="font-serif text-base font-bold text-morocco-dark group-hover:text-terracotta-600 transition-colors line-clamp-2">
                    {other.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
