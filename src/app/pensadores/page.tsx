import type { Metadata } from 'next';
import Link from 'next/link';
import { Cta } from '@/components/Cta';
import { Retrato } from '@/components/Retrato';
import { SiteHeader } from '@/components/SiteHeader';
import { getThinkers } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Pensadores',
  description: 'De Marco Aurélio a Camus: os pensadores do quiz e o que cada um defendia sobre como viver.',
};

export default function PensadoresPage() {
  const thinkers = [...getThinkers()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  return (
    <>
      <SiteHeader action={{ href: '/', label: 'Fazer o quiz' }} />
      <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Pensadores</h1>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {thinkers.map(t => (
            <Link key={t.id} href={`/pensadores/${t.id}`} className="lift press flex min-w-0 items-center gap-3 rounded-2xl border border-line bg-card p-3">
              <Retrato thinker={t} size={56} />
              <div className="min-w-0"><p className="font-semibold">{t.name}</p><p className="truncate text-sm text-mute">{t.descriptor}</p></div>
            </Link>
          ))}
        </div>
        <Cta />
      </main>
    </>
  );
}
