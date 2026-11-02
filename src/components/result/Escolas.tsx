import type { CSSProperties } from 'react';
import Link from 'next/link';
import { getFamilies } from '@/lib/data';
import { familyStyle } from '@/lib/family-theme';
import type { Result } from '@/lib/result';

// Cada escola aparece na cor da própria família, não na do resultado.
export function Escolas({ result }: { result: Result }) {
  const familias = new Map(getFamilies().map(f => [f.id, f]));
  const oposto = familias.get(result.opposite.familyId)!;
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        {result.otherSchools.map(({ school, score }) => {
          const f = familias.get(school.familyId)!;
          return (
            <Link
              key={school.id}
              href={`/escolas/${school.id}`}
              data-escola={school.id}
              style={familyStyle(f)}
              className="lift press group flex flex-col rounded-2xl border-t-4 border-brand bg-brand-soft p-4"
            >
              <span className="text-xs font-semibold text-brand">{f.name}</span>
              <span className="mt-1 font-display text-xl font-bold leading-tight">{school.name}</span>
              <span className="mt-2 line-clamp-3 text-sm italic text-ink/75">“{school.quote}”</span>
              <span className="mt-auto pt-4">
                <span className="flex items-baseline justify-between text-sm">
                  <span className="font-semibold text-brand">Ver escola <span className="nudge">→</span></span>
                  <span className="font-display font-bold text-brand">{Math.round(score)}%</span>
                </span>
                <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-white/70">
                  <span className="block h-full rounded-full bg-brand" style={{ width: `${Math.max(0, Math.min(100, score))}%` } as CSSProperties} />
                </span>
              </span>
            </Link>
          );
        })}
      </div>
      <Link
        href={`/escolas/${result.opposite.id}`}
        data-escola-oposta={result.opposite.id}
        style={familyStyle(oposto)}
        className="lift press group flex flex-col gap-3 rounded-2xl border border-dashed border-brand/50 bg-card p-5 sm:flex-row sm:items-center"
      >
        <div className="flex-1">
          <p className="text-sm font-semibold text-mute">Seu oposto filosófico · {oposto.name}</p>
          <p className="font-display text-3xl font-bold text-brand">{result.opposite.name}</p>
          <p className="mt-1 text-sm italic text-ink/75">“{result.opposite.quote}”</p>
        </div>
        <span className="text-sm font-semibold text-brand">Entender o outro lado <span className="nudge">→</span></span>
      </Link>
    </div>
  );
}
