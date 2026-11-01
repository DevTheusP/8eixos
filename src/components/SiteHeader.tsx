import { Logo } from '@/components/Rosa';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';

export function SiteHeader({ action }: { action?: { href: string; label: string } }) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="press group flex items-center gap-2 font-display text-2xl text-brand">
          <Logo size={30} />
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/escolas" className="hidden text-mute hover:text-ink sm:inline">Escolas</Link>
          <Link href="/pensadores" className="hidden text-mute hover:text-ink sm:inline">Pensadores</Link>
          <Link href="/sobre" className="hidden text-mute hover:text-ink sm:inline">Como funciona</Link>
          {action && (
            <Link href={action.href} className="press rounded-full bg-brand px-4 py-2 font-semibold text-white">
              {action.label}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
