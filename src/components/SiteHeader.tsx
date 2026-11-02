import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';

export function SiteHeader({ action }: { action?: { href: string; label: string } }) {
  return (
    <header className="relative z-10 border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="press group flex items-center gap-2 font-display text-xl font-bold">
          {/* Estrela de 8 pontas, uma por eixo: gira devagar e dá um giro a mais no hover. */}
          <svg aria-hidden width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="var(--amber)" strokeWidth="1.8" className="logo-estrela">
            <path d="M20 2v36M2 20h36M7.3 7.3l25.4 25.4M32.7 7.3 7.3 32.7" />
            <circle cx="20" cy="20" r="5" fill="var(--amber)" stroke="none" />
          </svg>
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/escolas" className="hidden text-mute hover:text-ink sm:inline">Escolas</Link>
          <Link href="/pensadores" className="hidden text-mute hover:text-ink sm:inline">Pensadores</Link>
          <Link href="/livros" className="hidden text-mute hover:text-ink sm:inline">Livros</Link>
          <Link href="/sobre" className="hidden text-mute hover:text-ink sm:inline">Como funciona</Link>
          {action && (
            <Link href={action.href} className="press group rounded-full bg-deep px-4 py-2 font-semibold text-white">
              {action.label} <span className="nudge">→</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
