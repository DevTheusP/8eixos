import { round1 } from './scoring';
import { AXIS_IDS, type AxisId, type Vector } from './types';

// Mesma ordem e letras de data/axes.json; fixas aqui porque a URL é um contrato público.
export const AXIS_PARAMS: Record<AxisId, string> = {
  controle: 'c', bemviver: 'b', sentido: 's', mundo: 'm', eu: 'e', rotina: 'r', guia: 'g', verdade: 'v',
};

export function vectorToParams(v: Vector): string {
  return AXIS_IDS.map(a => `${AXIS_PARAMS[a]}=${round1(v[a])}`).join('&');
}

export function paramsToVector(p: Record<string, string | string[] | undefined>): Vector | null {
  const out: Partial<Vector> = {};
  for (const a of AXIS_IDS) {
    const raw = p[AXIS_PARAMS[a]];
    const s = Array.isArray(raw) ? raw[0] : raw;
    if (s === undefined || s.trim() === '') return null;
    const n = Number(s);
    if (!Number.isFinite(n) || n < 0 || n > 100) return null;
    out[a] = n;
  }
  return out as Vector;
}

export function parseResultLink(input: string): Vector | null {
  const trimmed = input.trim();
  const qIndex = trimmed.indexOf('?');
  const query = qIndex >= 0 ? trimmed.slice(qIndex + 1) : trimmed;
  return paramsToVector(Object.fromEntries(new URLSearchParams(query.split('#')[0])));
}
