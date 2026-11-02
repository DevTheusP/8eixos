import { getAxes } from './data';
import type { Vector } from './types';

export type IntensityLabel = 'Equilibrado' | 'Tende' | 'Forte' | 'Muito forte';

export function intensity(v: number): { label: IntensityLabel; pole: 'A' | 'B' | null; percent: number } {
  const d = Math.abs(v - 50);
  const percent = Math.round(Math.max(v, 100 - v));
  if (d < 10) return { label: 'Equilibrado', pole: null, percent };
  const pole = v < 50 ? 'A' : 'B';
  if (d < 20) return { label: 'Tende', pole, percent };
  if (d < 35) return { label: 'Forte', pole, percent };
  return { label: 'Muito forte', pole, percent };
}

// Os eixos em que a pessoa mais se decidiu, do mais forte pro menos forte. Equilibrados ficam de fora.
export function tracosFortes(v: Vector, n: number) {
  return getAxes()
    .map(axis => ({ axis, ...intensity(v[axis.id]), dist: Math.abs(v[axis.id] - 50) }))
    .filter(t => t.pole !== null)
    .sort((a, b) => b.dist - a.dist)
    .slice(0, n)
    .map(({ axis, pole, percent, label }) => {
      const lado = pole as 'A' | 'B';
      return { axis, pole: lado, percent, label, nome: lado === 'A' ? axis.poleA : axis.poleB, desc: lado === 'A' ? axis.descA : axis.descB };
    });
}
