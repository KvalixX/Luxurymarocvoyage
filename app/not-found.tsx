import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <html lang="fr">
      <body className="min-h-screen flex items-center justify-center bg-[#1A0F0A] text-white p-6 font-sans">
        <div className="max-w-md text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#DF6951]/20 text-[#DF6951] flex items-center justify-center mb-6 border border-[#DF6951]/30">
            <Compass className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-widest text-[#C9963C] font-semibold mb-2">
            Erreur 404 • Page introuvable
          </span>
          <h1 className="text-3xl font-serif font-bold mb-4">
            Vous vous êtes égaré dans les dunes
          </h1>
          <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
            La page que vous recherchez semble introuvable ou a été déplacée vers un nouvel oasis.
          </p>
          <Link
            href="/fr"
            className="px-6 py-3 rounded-full bg-[#DF6951] hover:bg-[#c94e38] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-lg"
          >
            Retourner à l&apos;accueil
          </Link>
        </div>
      </body>
    </html>
  );
}
