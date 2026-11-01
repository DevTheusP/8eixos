import { getAxes } from '@/lib/data';
import { intensity } from '@/lib/labels';
import type { Vector } from '@/lib/types';

const CORES = ['var(--navy)', 'var(--gold)', 'var(--wine)'];

export function Eixos({ vector }: { vector: Vector }) {
  return (
    <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {getAxes().map((axis, i) => {
        const v = vector[axis.id];
        const info = intensity(v);
        const cor = info.pole ? CORES[i % CORES.length] : 'var(--mute)';
        const rotulo = info.pole === null ? 'Equilibrado' : `${info.percent}% ${info.pole === 'A' ? axis.poleA : axis.poleB}`;
        return (
          <div key={axis.id}>
            <div className="flex justify-between gap-2 font-semibold">
              <span>{axis.name}</span>
              <span className="text-xs font-medium" style={{ color: cor }}>{rotulo}</span>
            </div>
            <div className="relative my-2.5 h-2 rounded-full bg-[#e3ded2]" role="img" aria-label={`${axis.name}: ${rotulo}`}>
              <div
                className="absolute top-0 h-2 rounded-full"
                style={{ left: `${Math.min(v, 50)}%`, width: `${Math.abs(v - 50)}%`, background: cor }}
              />
              <div
                className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] bg-white"
                style={{ left: `${v}%`, borderColor: cor }}
              />
            </div>
            <div className="flex justify-between text-xs text-mute">
              <span>{axis.poleA}</span>
              <span>{axis.poleB}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
