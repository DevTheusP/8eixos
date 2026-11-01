import { round1 } from './scoring';
import { AXIS_IDS, type AxisId, type Vector } from './types';

// Pesos validados pelo teste de calibração em tests/matching.test.ts.
const W = { eixos: 0.45, direcao: 0.3, intensidade: 0.15, pior: 0.1 };

export const DIMENSOES: Record<'acao' | 'sentido' | 'pensar', { label: string; axes: AxisId[] }> = {
  acao: { label: 'Na ação', axes: ['controle', 'rotina', 'eu'] },
  sentido: { label: 'No sentido', axes: ['sentido', 'mundo', 'bemviver'] },
  pensar: { label: 'No pensar', axes: ['guia', 'verdade'] },
};

export function matchScore(user: Vector, profile: Vector, axes: readonly AxisId[] = AXIS_IDS): number {
  const n = axes.length;
  const u = axes.map(a => (user[a] - 50) / 50);
  const p = axes.map(a => (profile[a] - 50) / 50);
  const d = axes.map((a, i) => {
    let di = Math.abs(user[a] - profile[a]) / 100;
    if (u[i] * p[i] < 0 && Math.abs(u[i]) > 0.2 && Math.abs(p[i]) > 0.2) di += 0.25 * Math.min(Math.abs(u[i]), Math.abs(p[i]));
    return Math.min(di, 1);
  });
  const eixos = 1 - d.reduce((s, x) => s + x, 0) / n;
  const nu = Math.hypot(...u);
  const np = Math.hypot(...p);
  const amort = Math.min(1, nu / (0.25 * Math.sqrt(n)));
  const cos = nu === 0 || np === 0 ? 0 : u.reduce((s, x, i) => s + x * p[i], 0) / (nu * np);
  const direcao = amort * ((cos + 1) / 2) + (1 - amort) * eixos;
  const intensidade = 1 - Math.abs(nu - np) / Math.sqrt(n);
  const pior = 1 - Math.max(...d);
  return round1(100 * (W.eixos * eixos + W.direcao * direcao + W.intensidade * intensidade + W.pior * pior));
}

export function rank(
  user: Vector,
  profiles: Record<string, Vector>,
  axes?: readonly AxisId[],
): { id: string; score: number }[] {
  return Object.entries(profiles)
    .map(([id, v]) => ({ id, score: matchScore(user, v, axes) }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}
