import type { Metadata } from 'next';
import WishlistContent from '@/components/wishlist/WishlistContent';

interface WishlistPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: WishlistPageProps): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    fr: 'Mes favoris | Luxury Maroc Voyage',
    en: 'My Wishlist | Luxury Maroc Voyage',
    es: 'Mis favoritos | Luxury Maroc Voyage',
  };
  const descriptions: Record<string, string> = {
    fr: 'Retrouvez les circuits et excursions au Maroc enregistrés dans vos favoris.',
    en: 'Find the Morocco tours and excursions you saved to your wishlist.',
    es: 'Encuentra los circuitos y excursiones por Marruecos que guardaste en favoritos.',
  };
  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    robots: { index: false, follow: true },
  };
}

export default function WishlistPage() {
  return <WishlistContent />;
}
