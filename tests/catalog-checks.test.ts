import { axisCorrelations, checkProfileAnswers, findNearDuplicate, loadAllAnswers } from '@/lib/catalog-checks';
import { getQuestions, getVectors } from '@/lib/data';
import { computeVector } from '@/lib/scoring';
import { AXIS_IDS, type AnswerIndex, type Vector } from '@/lib/types';

const neutro = Object.fromEntries(AXIS_IDS.map(a => [a, 50])) as Vector;

test('perfil incompleto ou neutro demais', () => {
  const qs = getQuestions();
  const todas2 = Object.fromEntries(qs.map(q => [q.id, 2 as AnswerIndex]));
  expect(checkProfileAnswers({ profileId: 'x', kind: 'school', answers: todas2 }, qs).join()).toMatch(/neutr/i);
  expect(checkProfileAnswers({ profileId: 'x', kind: 'school', answers: {} }, qs).length).toBeGreaterThan(0);
  const ok = Object.fromEntries(qs.map((q, i) => [q.id, (i % 2 === 0 ? 0 : 4) as AnswerIndex]));
  expect(checkProfileAnswers({ profileId: 'x', kind: 'school', answers: ok }, qs)).toEqual([]);
  expect(checkProfileAnswers({ profileId: 'x', kind: 'school', answers: { ...ok, inventada_99: 0 } }, qs).join()).toMatch(/desconhecid/i);
});

test('quase duplicado', () => {
  const a = { ...neutro, controle: 20 };
  expect(findNearDuplicate({ ...a, controle: 25 }, { a })).toBe('a');
  expect(findNearDuplicate({ ...a, controle: 40 }, { a })).toBeNull();
});

test('correlação perfeita é detectada', () => {
  const vs = [10, 40, 70].map(x => ({ ...neutro, controle: x, rotina: x, guia: 100 - x, verdade: x % 20 }));
  const pares = axisCorrelations(vs);
  expect(pares).toHaveLength(28);
  expect(pares.find(c => c.a === 'controle' && c.b === 'rotina')!.r).toBeCloseTo(1);
});

test('vectors.json está em dia com as respostas', () => {
  const qs = getQuestions();
  const vs = getVectors();
  for (const pa of loadAllAnswers()) {
    const grupo = pa.kind === 'school' ? vs.schools : vs.thinkers;
    expect(grupo[pa.profileId]).toEqual(computeVector(qs, pa.answers));
  }
});
