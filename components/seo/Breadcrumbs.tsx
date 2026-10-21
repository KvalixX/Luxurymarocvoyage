import { Link } from '@/lib/i18n/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { localizedUrl } from '@/lib/seo/urls';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  locale: string;
}

export default function Breadcrumbs({ items, locale }: BreadcrumbsProps) {
  // BreadcrumbList JSON-LD Schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href
        ? localizedUrl(locale, item.href)
        : undefined,
    })),
  };

  return (
    <nav aria-label="Fil d'Ariane" className="py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-sand-700">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-terracotta-600 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-sand-500" />
            <span className="sr-only">Accueil</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-sand-400 shrink-0" />
              {isLast || !item.href ? (
                <span className="font-semibold text-morocco-charcoal line-clamp-1 max-w-[200px] sm:max-w-md">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href as any}
                  className="hover:text-terracotta-600 transition-colors line-clamp-1"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
