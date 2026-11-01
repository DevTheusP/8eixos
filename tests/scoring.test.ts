import { computeVector } from '@/lib/scoring';
import { intensity } from '@/lib/labels';
import type { AxisId, Question } from '@/lib/types';

const q = (id: string, axis: AxisId, polarity: 'A' | 'B'): Question => ({ id, axis, kind: 'likert', polarity, text: id });

test('concordar totalmente com afirmação do polo A puxa para 0', () => {
  expect(computeVector([q('x', 'controle', 'A')], { x: 0 }).controle).toBe(0);
});
test('mistura de polos', () => {
  const qs = [q('a', 'guia', 'A'), q('b', 'guia', 'B')];
  expect(computeVector(qs, { a: 0, b: 1 }).guia).toBe(37.5);
});
test('eixo sem respostas fica em 50', () => {
  expect(computeVector([], {}).verdade).toBe(50);
});
test('intensidade', () => {
  expect(intensity(50)).toEqual({ label: 'Equilibrado', pole: null, percent: 50 });
  expect(intensity(28)).toEqual({ label: 'Forte', pole: 'A', percent: 72 });
  expect(intensity(90)).toEqual({ label: 'Muito forte', pole: 'B', percent: 90 });
});
