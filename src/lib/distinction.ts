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
