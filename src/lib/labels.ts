import { getAxes } from './data';
import type { Axis, Vector } from './types';

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

// No card, cada eixo sempre mostra um lado: o que a pessoa pende, mesmo que pouco. No meio exato, o primeiro polo.
export function poloDoCard(axis: Axis, v: number) {
  const lado: 'A' | 'B' = v <= 50 ? 'A' : 'B';
  return { lado, nome: lado === 'A' ? axis.poleA : axis.poleB, percent: Math.round(Math.max(v, 100 - v)), decidido: intensity(v).pole !== null };
}

// Os n eixos em que a pessoa mais pende, mesmo que pouco: os decididos vêm primeiro, e o resto é marcado como leve.
// Eixos exatamente no meio ficam de fora (não há lado pra mostrar).
export function tracosPrincipais(v: Vector, n: number) {
  return getAxes()
    .filter(axis => v[axis.id] !== 50)
    .map(axis => ({ axis, dist: Math.abs(v[axis.id] - 50), info: intensity(v[axis.id]), p: poloDoCard(axis, v[axis.id]) }))
    .sort((a, b) => b.dist - a.dist)
    .slice(0, n)
    .map(({ axis, info, p }) => ({
      axis, pole: p.lado, nome: p.nome, percent: p.percent, label: info.label,
      desc: p.lado === 'A' ? axis.descA : axis.descB, leve: info.pole === null,
    }));
}
