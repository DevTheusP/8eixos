import type { CSSProperties } from 'react';
import { InView } from '@/components/InView';
import { CORES_EIXO } from '@/lib/card-assets';
import { getAxes } from '@/lib/data';
import { POLE_ICONS } from '@/lib/icons';
import { intensity, poloDoCard } from '@/lib/labels';
import type { Vector } from '@/lib/types';

const maiuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

// Os 8 eixos no mesmo padrão do card de story: ícone na cor do eixo, o lado em que a pessoa pende, a régua e o que isso quer dizer.
export function Eixos({ vector, ids }: { vector: Vector; ids?: string[] }) {
  return (
    <InView className="grid gap-3 sm:grid-cols-2">
      {getAxes().filter(a => !ids || ids.includes(a.id)).map((axis, i) => {
        const v = vector[axis.id];
        const info = intensity(v);
        const p = poloDoCard(axis, v);
        const corEixo = CORES_EIXO[axis.id];
        const cor = p.decidido ? corEixo : 'var(--mute)';
        const delay = { '--d': `${i * 70}ms` } as CSSProperties;
        const Destaque = POLE_ICONS[axis.id][p.lado];
        const significado = p.decidido ? maiuscula(p.lado === 'A' ? axis.descA : axis.descB) : `Você fica no meio: um pouco de ${axis.poleA.toLowerCase()} e um pouco de ${axis.poleB.toLowerCase()}.`;
        const polos = [
          { lado: 'A' as const, nome: axis.poleA, Icone: POLE_ICONS[axis.id].A },
          { lado: 'B' as const, nome: axis.poleB, Icone: POLE_ICONS[axis.id].B },
        ];
        return (
          <div key={axis.id} data-axis={axis.id} className="lift overflow-x-clip rounded-2xl border border-line bg-tile p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl text-bg" style={{ background: corEixo }}>
                <Destaque aria-hidden size={21} strokeWidth={2.4} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-mute">{axis.name}</p>
                <p className="font-bold" style={{ color: p.decidido ? corEixo : undefined }}>{p.decidido ? p.nome : 'Equilibrado'}</p>
              </div>
              <span className="font-display text-2xl font-bold" style={{ color: cor }}>{info.percent}%</span>
            </div>
            <div className="relative mb-2 mt-4 h-2 rounded-full bg-track" role="img" aria-label={`${axis.name}: ${p.decidido ? `${info.percent}% ${p.nome}` : 'equilibrado'}`}>
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
                  <span key={lado} data-dominant={dominante} className={`inline-flex items-center gap-1 ${dominante ? 'font-semibold' : 'text-mute'}`} style={dominante ? { color: corEixo } : undefined}>
                    {lado === 'A' && <Icone aria-hidden size={13} strokeWidth={2.2} />}
                    {nome}
                    {lado === 'B' && <Icone aria-hidden size={13} strokeWidth={2.2} />}
                  </span>
                );
              })}
            </div>
            <p className="mt-3 border-t border-line pt-3 text-sm leading-relaxed text-ink/80">{significado}</p>
          </div>
        );
      })}
    </InView>
  );
}
