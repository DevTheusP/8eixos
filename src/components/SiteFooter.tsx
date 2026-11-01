import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-4 py-6 text-sm text-mute sm:px-6">
        <span>© {SITE_NAME}</span>
        <nav className="flex flex-wrap gap-4">
          <Link href="/sobre" className="hover:text-ink">Como funciona</Link>
          <Link href="/escolas" className="hover:text-ink">Escolas</Link>
          <Link href="/pensadores" className="hover:text-ink">Pensadores</Link>
          <Link href="/privacidade" className="hover:text-ink">Privacidade</Link>
          <Link href="/creditos" className="hover:text-ink">Créditos</Link>
        </nav>
      </div>
    </footer>
  );
}
