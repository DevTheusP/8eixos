import type { CSSProperties } from 'react';
import { InView } from '@/components/InView';
import { getAxes } from '@/lib/data';
import { POLE_ICONS } from '@/lib/icons';
import { intensity } from '@/lib/labels';
import type { Vector } from '@/lib/types';

const CORES = ['var(--brand)', 'var(--ochre)', 'var(--clay)'];

export function Eixos({ vector }: { vector: Vector }) {
  return (
    <InView className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      {getAxes().map((axis, i) => {
        const v = vector[axis.id];
        const info = intensity(v);
        const cor = info.pole ? CORES[i % CORES.length] : 'var(--mute)';
        const rotulo = info.pole === null ? 'Equilibrado' : `${info.percent}% ${info.pole === 'A' ? axis.poleA : axis.poleB}`;
        const delay = { '--d': `${i * 70}ms` } as CSSProperties;
        const polos = [
          { lado: 'A' as const, nome: axis.poleA, Icone: POLE_ICONS[axis.id].A },
          { lado: 'B' as const, nome: axis.poleB, Icone: POLE_ICONS[axis.id].B },
        ];
        return (
          <div key={axis.id} data-axis={axis.id}>
            <div className="flex justify-between gap-2 font-semibold">
              <span>{axis.name}</span>
              <span className="text-xs font-medium" style={{ color: cor }}>{rotulo}</span>
            </div>
            <div className="relative my-3 h-2 rounded-full bg-track" role="img" aria-label={`${axis.name}: ${rotulo}`}>
              <span className="absolute left-1/2 top-[-3px] h-[14px] w-px bg-mute/40" />
              <div
                className="axis-fill absolute top-0 h-2 rounded-full"
                style={{ ...delay, left: `${Math.min(v, 50)}%`, width: `${Math.abs(v - 50)}%`, background: cor, '--origin': v < 50 ? 'right' : 'left' } as CSSProperties}
              />
              <div data-knob-track className="knob-track pointer-events-none absolute inset-0" style={{ ...delay, '--to': `${v}%` } as CSSProperties}>
                <span className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] bg-white shadow-sm" style={{ borderColor: cor }} />
              </div>
            </div>
            <div className="flex justify-between gap-2 text-xs">
              {polos.map(({ lado, nome, Icone }) => {
                const dominante = info.pole === lado;
                return (
                  <span
                    key={lado}
                    data-dominant={dominante}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 ${dominante ? 'font-semibold' : 'text-mute'}`}
                    style={dominante ? { color: cor, background: `color-mix(in srgb, ${cor} 12%, transparent)`, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${cor} 35%, transparent)` } : undefined}
                  >
                    {lado === 'A' && <Icone aria-hidden size={14} strokeWidth={2.2} />}
                    {nome}
                    {lado === 'B' && <Icone aria-hidden size={14} strokeWidth={2.2} />}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </InView>
  );
}
