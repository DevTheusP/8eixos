import { Compass } from 'lucide-react';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';

export function SiteHeader({ action }: { action?: { href: string; label: string } }) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="press group flex items-center gap-2 font-display text-xl font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white transition-transform duration-500 ease-[var(--ease-out)] group-hover:rotate-45">
            <Compass aria-hidden size={18} strokeWidth={2.4} />
          </span>
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/escolas" className="hidden text-mute hover:text-ink sm:inline">Escolas</Link>
          <Link href="/pensadores" className="hidden text-mute hover:text-ink sm:inline">Pensadores</Link>
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
