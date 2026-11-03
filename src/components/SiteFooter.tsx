import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-4 py-6 text-sm text-mute sm:px-6">
        <span className="inline-flex min-h-11 items-center">© {SITE_NAME}</span>
        <nav className="-mx-2 flex flex-wrap gap-x-1">
          <Link href="/sobre" className="inline-flex min-h-11 items-center rounded-lg px-2 hover:text-ink">Como funciona</Link>
          <Link href="/escolas" className="inline-flex min-h-11 items-center rounded-lg px-2 hover:text-ink">Escolas</Link>
          <Link href="/pensadores" className="inline-flex min-h-11 items-center rounded-lg px-2 hover:text-ink">Pensadores</Link>
          <Link href="/livros" className="inline-flex min-h-11 items-center rounded-lg px-2 hover:text-ink">Livros</Link>
          <Link href="/privacidade" className="inline-flex min-h-11 items-center rounded-lg px-2 hover:text-ink">Privacidade</Link>
          <Link href="/creditos" className="inline-flex min-h-11 items-center rounded-lg px-2 hover:text-ink">Créditos</Link>
        </nav>
      </div>
    </footer>
  );
}
