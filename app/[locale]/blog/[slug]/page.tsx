import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getArticleBySlug, getArticleSlugs, getArticles } from '@/lib/queries/articles';
import { Link } from '@/lib/i18n/navigation';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { ArrowLeft, ArrowRight, Calendar, User } from 'lucide-react';
import { localizedAlternates, localizedUrl } from '@/lib/seo/urls';
import { seoDescription } from '@/lib/seo/text';

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

  const canonicalUrl = localizedUrl(locale, '/blog/[slug]', { slug });
  const cleanDescription = seoDescription(article.description, article.title);

  return {
    title: `${article.title} | ${locale === 'en' ? 'Morocco Travel Journal' : locale === 'es' ? 'Blog de viajes por Marruecos' : 'Journal de voyage au Maroc'}`,
    description: cleanDescription,
    alternates: localizedAlternates(locale, '/blog/[slug]', { slug }),
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

  const articleList = await getArticles(locale, 50).catch(() => []);
  const currentIndex = articleList.findIndex((item) => item.slug === article.slug);
  const previousArticle = currentIndex >= 0 ? articleList[currentIndex + 1] : undefined;
  const nextArticle = currentIndex > 0 ? articleList[currentIndex - 1] : undefined;
  const relatedArticles = articleList.filter((item) => item.slug !== article.slug).slice(0, 3);
  const recentArticles = relatedArticles.slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxurymarocvoyage.com';
  const canonicalUrl = localizedUrl(locale, '/blog/[slug]', { slug: article.slug });
  const formatArticleDate = (value: string | Date) =>
    new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(value));

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
        url: `${siteUrl}/logos/android-chrome-512x512.png`,
      },
    },
    description: seoDescription(article.description, article.title),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
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
    <div className="min-h-screen bg-morocco-cream pb-20 pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <Breadcrumbs items={breadcrumbs} locale={locale} />
      <div className="mx-auto mt-4 grid max-w-7xl grid-cols-1 items-start gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <article className="min-w-0">
          <header className="mb-7">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {article.category && <span className="rounded-full bg-terracotta-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-terracotta-700">{article.category}</span>}
              {article.date && <div className="flex items-center gap-1.5 text-xs text-sand-700"><Calendar className="h-3.5 w-3.5 text-terracotta-500" /><time dateTime={new Date(article.date).toISOString()}>{formatArticleDate(article.date)}</time></div>}
              <div className="flex items-center gap-1.5 text-xs text-sand-700"><User className="h-3.5 w-3.5 text-sand-500" /><span>{locale === 'en' ? 'By the Luxurymarocvoyage team' : locale === 'es' ? 'Por el equipo de Luxurymarocvoyage' : 'Par l’équipe Luxurymarocvoyage'}</span></div>
            </div>
            <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight text-morocco-dark sm:text-5xl">{article.title}</h1>
          </header>
          <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-md">
            <Image src={imageUrl} alt={article.title} fill priority sizes="(max-width: 1024px) 100vw, 850px" className="object-cover" />
          </div>
          <div className="rounded-3xl border border-sand-200 bg-white p-6 text-left shadow-sm sm:p-9">
            <div className="prose prose-lg mx-0 max-w-none text-left leading-relaxed text-sand-900 [&_*]:text-left" dangerouslySetInnerHTML={{ __html: article.description.replace(/\n\n/g, '<br /><br />') }} />
            <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-sand-300/80 bg-morocco-warm/80 p-6 sm:flex-row sm:items-center sm:p-8">
              <div>
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-terracotta-600">{locale === 'en' ? 'Inspired by this article?' : locale === 'es' ? '¿Te ha inspirado este artículo?' : 'Inspiré par cette lecture ?'}</span>
                <h2 className="font-serif text-xl font-bold text-morocco-dark">{locale === 'en' ? 'Plan your tailor-made Morocco trip' : locale === 'es' ? 'Planifica tu viaje a medida por Marruecos' : 'Planifiez votre séjour sur mesure au Maroc'}</h2>
                <p className="mt-1 text-sm leading-6 text-sand-800">{locale === 'en' ? 'Our travel advisors will design your ideal itinerary.' : locale === 'es' ? 'Nuestros asesores diseñarán tu itinerario ideal.' : 'Nos conseillers conçoivent votre itinéraire idéal.'}</p>
              </div>
              <Link href="/contact" className="shrink-0 rounded-full bg-terracotta-500 px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-terracotta-600">{locale === 'en' ? 'Request a quote' : locale === 'es' ? 'Solicitar presupuesto' : 'Demander un devis'}</Link>
            </div>
          </div>
          {(previousArticle || nextArticle) && (
            <nav aria-label="Article navigation" className="mt-8 grid overflow-hidden rounded-2xl border border-slate-200 bg-white sm:grid-cols-2">
              {previousArticle ? (
                <Link href={`/blog/${previousArticle.slug}` as any} className="flex min-w-0 items-center gap-3 border-b border-slate-200 p-4 transition hover:bg-slate-50 sm:border-b-0 sm:border-r sm:p-5">
                  <ArrowLeft className="h-5 w-5 shrink-0 text-indigo-700" />
                  <span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-wide text-slate-500">{locale === 'fr' ? 'Article précédent' : locale === 'es' ? 'Artículo anterior' : 'Previous post'}</span><span className="mt-1 block truncate text-sm font-semibold text-indigo-800">{previousArticle.title}</span></span>
                </Link>
              ) : <span className="hidden sm:block" />}
              {nextArticle ? (
                <Link href={`/blog/${nextArticle.slug}` as any} className="flex min-w-0 items-center justify-end gap-3 p-4 text-right transition hover:bg-slate-50 sm:p-5">
                  <span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-wide text-slate-500">{locale === 'fr' ? 'Article suivant' : locale === 'es' ? 'Artículo siguiente' : 'Next post'}</span><span className="mt-1 block truncate text-sm font-semibold text-indigo-800">{nextArticle.title}</span></span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-indigo-700" />
                </Link>
              ) : null}
            </nav>
          )}
        </article>
        <aside className="space-y-7 lg:sticky lg:top-24">
          <section className="rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-[0_12px_32px_-24px_rgba(24,30,75,0.4)]">
            <h2 className="mb-5 font-serif text-xl font-bold text-morocco-dark">{locale === 'fr' ? 'Articles récents' : locale === 'es' ? 'Artículos recientes' : 'Recent Articles'}</h2>
            <div className="space-y-5">
              {recentArticles.map((recent) => {
                const recentImage = recent.imageUrl?.startsWith('http') ? recent.imageUrl : defaultImage;
                return <Link key={recent.id} href={`/blog/${recent.slug}` as any} className="group flex items-center gap-4">
                  <span className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl bg-slate-200"><Image src={recentImage} alt={recent.title} fill sizes="76px" className="object-cover transition-transform group-hover:scale-105" /></span>
                  <span className="min-w-0"><time dateTime={new Date(recent.date).toISOString()} className="block text-xs text-slate-500">{formatArticleDate(recent.date)}</time><span className="mt-1 block line-clamp-3 text-sm font-semibold leading-5 text-indigo-800 transition-colors group-hover:text-terracotta-600">{recent.title}</span></span>
                </Link>;
              })}
            </div>
          </section>
          <Link href="/blog" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#181E4B] px-5 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#242d68]"><ArrowLeft className="h-4 w-4" />{locale === 'fr' ? 'Retour au blog' : locale === 'es' ? 'Volver al blog' : 'Back to Blog'}</Link>
        </aside>
        <section className="min-w-0 lg:col-span-1" aria-labelledby="related-articles-title">
          <h2 id="related-articles-title" className="mb-5 border-b border-slate-200 pb-4 font-serif text-2xl font-bold text-morocco-dark">{locale === 'fr' ? 'Articles similaires' : locale === 'es' ? 'Artículos relacionados' : 'Related Articles'}</h2>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {relatedArticles.map((related) => {
              const relatedImage = related.imageUrl?.startsWith('http') ? related.imageUrl : defaultImage;
              return <Link key={related.id} href={`/blog/${related.slug}` as any} className="group min-w-0">
                <span className="relative mb-3 block aspect-[4/2.4] overflow-hidden rounded-2xl bg-slate-200"><Image src={relatedImage} alt={related.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" /></span>
                <time dateTime={new Date(related.date).toISOString()} className="mb-2 flex items-center gap-1.5 text-xs text-slate-500"><Calendar className="h-3.5 w-3.5" />{formatArticleDate(related.date)}</time>
                <h3 className="line-clamp-2 text-sm font-bold leading-5 text-indigo-800 transition-colors group-hover:text-terracotta-600">{related.title}</h3>
              </Link>;
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
