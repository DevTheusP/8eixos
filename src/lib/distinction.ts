import { AXIS_IDS, type AxisId, type Vector } from './types';

export function mostUnusual(u: Vector, catalog: Vector[]): { axis: AxisId; pct: number } | null {
  let best: { axis: AxisId; pct: number } | null = null;
  for (const axis of AXIS_IDS) {
    const desvio = u[axis] - 50;
    if (Math.abs(desvio) < 10 || catalog.length === 0) continue;
    const lado = Math.sign(desvio);
    const menos = catalog.filter(p => (p[axis] - 50) * lado < desvio * lado).length;
    const pct = Math.round((menos / catalog.length) * 100);
    if (!best || pct > best.pct) best = { axis, pct };
  }
  return best;
}

function median(xs: number[]): number {
  if (xs.length === 0) return 50;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function mostCommon(u: Vector, catalog: Vector[]): { axis: AxisId; centered: boolean } {
  let best = AXIS_IDS[0];
  let bestDiff = Infinity;
  for (const axis of AXIS_IDS) {
    const diff = Math.abs(u[axis] - median(catalog.map(p => p[axis])));
    if (diff < bestDiff) {
      best = axis;
      bestDiff = diff;
    }
  }
  return { axis: best, centered: Math.abs(u[best] - 50) < 10 };
}

type Lado = { axis: AxisId; pole: 'A' | 'B' };

// Par de posições marcantes da pessoa que quase ninguém do catálogo combina. Só conta como tensão se for rara (até 25%).
export function tensao(u: Vector, catalog: Vector[]): { a: Lado; b: Lado; count: number; total: number } | null {
  const marcantes = AXIS_IDS.filter(ax => Math.abs(u[ax] - 50) >= 15);
  const lado = (v: number) => (v < 50 ? 'A' : 'B') as 'A' | 'B';
  let melhor: { a: Lado; b: Lado; count: number; total: number } | null = null;
  for (let i = 0; i < marcantes.length; i++) {
    for (let j = i + 1; j < marcantes.length; j++) {
      const [x, y] = [marcantes[i], marcantes[j]];
      const count = catalog.filter(p =>
        Math.abs(p[x] - 50) >= 10 && Math.abs(p[y] - 50) >= 10 && lado(p[x]) === lado(u[x]) && lado(p[y]) === lado(u[y]),
      ).length;
      if (!melhor || count < melhor.count) {
        melhor = { a: { axis: x, pole: lado(u[x]) }, b: { axis: y, pole: lado(u[y]) }, count, total: catalog.length };
      }
    }
  }
  return melhor && melhor.count / melhor.total <= 0.25 ? melhor : null;
}
