import { getFamilies, getSchools, getThinkers, getVectors } from './data';
import { mostCommon, mostUnusual } from './distinction';
import { DIMENSOES, rank } from './matching';
import type { Family, School, Thinker, Vector } from './types';

export type Dimensao = keyof typeof DIMENSOES;

export interface Result {
  vector: Vector;
  school: { school: School; family: Family; score: number };
  otherSchools: { school: School; score: number }[];
  opposite: School;
  thinker: { thinker: Thinker; score: number };
  byDimension: { dim: Dimensao; thinker: Thinker; score: number }[];
  farthestThinkers: Thinker[];
  unusual: ReturnType<typeof mostUnusual>;
  common: ReturnType<typeof mostCommon>;
}

export function buildResult(v: Vector): Result {
  const vectors = getVectors();
  const schools = new Map(getSchools().map(s => [s.id, s]));
  const thinkers = new Map(getThinkers().map(t => [t.id, t]));
  const families = new Map(getFamilies().map(f => [f.id, f]));

  const rs = rank(v, vectors.schools);
  const rt = rank(v, vectors.thinkers);
  const principal = schools.get(rs[0].id)!;
  const pensador = thinkers.get(rt[0].id)!;

  const usados = new Set([pensador.id]);
  const byDimension = (Object.keys(DIMENSOES) as Dimensao[]).map(dim => {
    const melhor = rank(v, vectors.thinkers, DIMENSOES[dim].axes).find(r => !usados.has(r.id))!;
    usados.add(melhor.id);
    return { dim, thinker: thinkers.get(melhor.id)!, score: melhor.score };
  });

  const catalogo = Object.values(vectors.schools);
  return {
    vector: v,
    school: { school: principal, family: families.get(principal.familyId)!, score: rs[0].score },
    otherSchools: rs.slice(1, 4).map(r => ({ school: schools.get(r.id)!, score: r.score })),
    opposite: schools.get(rs.at(-1)!.id)!,
    thinker: { thinker: pensador, score: rt[0].score },
    byDimension,
    farthestThinkers: rt.slice(-3).reverse().map(r => thinkers.get(r.id)!),
    unusual: mostUnusual(v, catalogo),
    common: mostCommon(v, catalogo),
  };
}
