import Link from 'next/link';
import { DIMENSOES } from '@/lib/matching';
import type { Result } from '@/lib/result';
import { Ring } from './Section';
import { Retrato } from '../Retrato';

export function Pensadores({ result }: { result: Result }) {
  const { thinker, score } = result.thinker;
  return (
    <div>
      <Link href={`/pensadores/${thinker.id}`} className="lift press group flex flex-col gap-4 rounded-2xl bg-brand-soft p-5 sm:flex-row sm:items-center">
        <Retrato thinker={thinker} size={112} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-brand">O mais parecido com você</p>
          <p className="font-display text-3xl font-bold leading-tight">{thinker.name}</p>
          <p className="text-sm text-mute">{thinker.descriptor} · {thinker.years}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/80">{thinker.bio}</p>
          <p className="mt-2 text-sm font-semibold text-brand">Ler sobre {thinker.name} <span className="nudge">→</span></p>
        </div>
        <Ring score={score} />
      </Link>
      <p className="mt-6 text-sm font-semibold">Parecidos com você em cada área</p>
      <div className="mt-2 grid gap-3 sm:grid-cols-3">
        {result.byDimension.map(d => (
          <Link key={d.dim} href={`/pensadores/${d.thinker.id}`} className="lift press flex flex-col items-start rounded-2xl border border-line bg-card p-4">
            <Retrato thinker={d.thinker} size={64} />
            <p className="mt-3 text-xs font-semibold text-brand">{DIMENSOES[d.dim].label}</p>
            <p className="font-display text-lg font-bold leading-tight">{d.thinker.name}</p>
            <p className="text-xs text-mute">{d.thinker.descriptor}</p>
          </Link>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold text-mute">Pensam o oposto de você</span>
        {result.farthestThinkers.map(t => (
          <Link key={t.id} href={`/pensadores/${t.id}`} className="press inline-flex items-center gap-2 rounded-full bg-tile-strong py-1 pl-1 pr-3 text-mute hover:text-ink">
            <Retrato thinker={t} size={24} />
            {t.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
