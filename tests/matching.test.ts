import { DIMENSOES, matchScore, rank } from '@/lib/matching';
import { seededRng } from '@/lib/selection';
import { AXIS_IDS, type Vector } from '@/lib/types';

const neutro = Object.fromEntries(AXIS_IDS.map(a => [a, 50])) as Vector;

test('perfil idêntico = 100', () => {
  const v = { ...neutro, controle: 20, guia: 80 };
  expect(matchScore(v, v)).toBe(100);
});
test('tudo neutro não gera NaN', () => {
  expect(Number.isFinite(matchScore(neutro, neutro))).toBe(true);
  expect(Number.isFinite(matchScore(neutro, { ...neutro, mundo: 90 }))).toBe(true);
});
test('oposto pontua menos que vizinho', () => {
  const u = { ...neutro, controle: 20, bemviver: 25 };
  expect(matchScore(u, { ...neutro, controle: 25, bemviver: 30 }))
    .toBeGreaterThan(matchScore(u, { ...neutro, controle: 80, bemviver: 75 }));
});
test('moderado não casa melhor com extremo do que com moderado', () => {
  const u = { ...neutro, sentido: 35, verdade: 35 };
  expect(matchScore(u, { ...neutro, sentido: 35, verdade: 35 }))
    .toBeGreaterThan(matchScore(u, { ...neutro, sentido: 0, verdade: 0 }));
});
test('subconjunto de eixos ignora os outros', () => {
  const u = { ...neutro, guia: 20, verdade: 80, controle: 0 };
  expect(matchScore(u, { ...neutro, guia: 20, verdade: 80, controle: 100 }, DIMENSOES.pensar.axes)).toBe(100);
});
test('rank ordena e desempata por id', () => {
  const r = rank(neutro, { b: neutro, a: neutro, c: { ...neutro, mundo: 0 } });
  expect(r.map(x => x.id)).toEqual(['a', 'b', 'c']);
});
test('calibração com catálogo sintético', () => {
  const rng = seededRng(42);
  const catalogo = Object.fromEntries(Array.from({ length: 20 }, (_, k) =>
    [`p${k}`, Object.fromEntries(AXIS_IDS.map(a => [a, Math.round(rng() * 100)])) as Vector]));
  let acertos = 0;
  let total = 0;
  for (const [id, v] of Object.entries(catalogo)) for (let t = 0; t < 20; t++) {
    const ruidoso = Object.fromEntries(AXIS_IDS.map(a => [a, Math.min(100, Math.max(0, v[a] + (rng() - 0.5) * 30))])) as Vector;
    if (rank(ruidoso, catalogo).slice(0, 3).some(r => r.id === id)) acertos++;
    total++;
  }
  expect(acertos / total).toBeGreaterThanOrEqual(0.9);
});
