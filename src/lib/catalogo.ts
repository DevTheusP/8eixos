import { getSchools, getVectors } from './data';
import { rank } from './matching';

export function parecidos(kind: 'school' | 'thinker', id: string, n: number): { id: string; score: number }[] {
  const vs = getVectors();
  const grupo = kind === 'school' ? vs.schools : vs.thinkers;
  const outros = Object.fromEntries(Object.entries(grupo).filter(([k]) => k !== id));
  return rank(grupo[id], outros).slice(0, n);
}

// Pares de escolas em ordem alfabética de id: cada comparação tem um único endereço.
export function paresDeEscolas(): { id: string; outro: string }[] {
  const ids = getSchools().map(s => s.id).sort();
  return ids.flatMap((a, i) => ids.slice(i + 1).map(b => ({ id: a, outro: b })));
}
