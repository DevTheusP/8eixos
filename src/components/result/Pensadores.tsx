import Link from 'next/link';
import { DIMENSOES } from '@/lib/matching';
import type { Result } from '@/lib/result';
import { Ring } from './Section';
import { Retrato } from '../Retrato';

export function Pensadores({ result }: { result: Result }) {
  const { thinker, score } = result.thinker;
  return (
    <div>
      <div className="flex items-center gap-4 rounded-2xl border-t-[3px] border-brand bg-tile-strong p-4">
        <Retrato thinker={thinker} size={84} />
        <div className="min-w-0 flex-1">
          <p className="font-display text-2xl font-bold">{thinker.name}</p>
          <p className="text-sm text-mute">{thinker.descriptor} · {thinker.years}</p>
          <Link href={`/pensadores/${thinker.id}`} className="mt-1 inline-block text-sm font-semibold text-brand">
            + Saber mais sobre {thinker.name}
          </Link>
        </div>
        <Ring score={score} />
      </div>
      <p className="mt-5 text-xs font-semibold text-brand">Parecidos com você em cada área</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        {result.byDimension.map(d => (
          <Link key={d.dim} href={`/pensadores/${d.thinker.id}`} className="lift press flex items-center gap-3 rounded-xl bg-tile p-3">
            <Retrato thinker={d.thinker} size={40} />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-brand">{DIMENSOES[d.dim].label}</p>
              <p className="truncate text-sm font-semibold">{d.thinker.name}</p>
            </div>
            <span className="font-display font-bold text-brand">{Math.round(d.score)}%</span>
          </Link>
        ))}
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-mute">Pensam o oposto de você</span>
        {result.farthestThinkers.map(t => (
          <span key={t.id} className="rounded-full bg-tile-strong px-3 py-1 text-mute">{t.name}</span>
        ))}
      </p>
    </div>
  );
}
