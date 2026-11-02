import type { CSSProperties } from 'react';
import { POLE_ICONS } from '@/lib/icons';
import { tracosFortes } from '@/lib/labels';
import type { Vector } from '@/lib/types';

const CORES = ['var(--brand)', 'var(--mint)', 'var(--amber)'];

// Os três eixos em que a pessoa mais se decidiu, cada um com a frase do polo.
export function Tracos({ vector }: { vector: Vector }) {
  const tracos = tracosFortes(vector, 3);
  if (tracos.length === 0) {
    return <p className="text-sm text-mute">Você ficou perto do centro em todos os eixos: nenhum lado pesa mais que o outro.</p>;
  }
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {tracos.map((t, i) => {
        const Icone = POLE_ICONS[t.axis.id][t.pole];
        const cor = CORES[i % CORES.length];
        return (
          <div
            key={t.axis.id}
            className="flex flex-col rounded-2xl p-5"
            style={{ background: `color-mix(in srgb, ${cor} 9%, var(--card))`, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${cor} 22%, transparent)` }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-white" style={{ background: cor }}>
                <Icone aria-hidden size={22} strokeWidth={2.2} />
              </span>
              <span className="text-xs font-semibold" style={{ color: cor } as CSSProperties}>{t.label} · {t.percent}%</span>
            </div>
            <p className="mt-4 text-xs font-semibold text-mute">{t.axis.name}</p>
            <p className="font-display text-2xl font-bold" style={{ color: cor }}>{t.nome}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">{t.desc.charAt(0).toUpperCase() + t.desc.slice(1)}</p>
          </div>
        );
      })}
    </div>
  );
}
