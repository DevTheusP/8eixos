import { mostCommon, mostUnusual } from '@/lib/distinction';
import { AXIS_IDS, type Vector } from '@/lib/types';

const neutro = Object.fromEntries(AXIS_IDS.map(a => [a, 50])) as Vector;

test('tudo neutro: sem posição incomum, comum centralizada', () => {
  const cat = [10, 30, 70].map(x => ({ ...neutro, guia: x }));
  expect(mostUnusual(neutro, cat)).toBeNull();
  expect(mostCommon(neutro, cat).centered).toBe(true);
});
test('posição incomum', () => {
  const cat = [10, 30, 45, 55].map(x => ({ ...neutro, bemviver: x }));
  expect(mostUnusual({ ...neutro, bemviver: 5 }, cat)).toEqual({ axis: 'bemviver', pct: 100 });
});
test('posição incomum do lado B', () => {
  const cat = [10, 70, 80, 95].map(x => ({ ...neutro, mundo: x }));
  expect(mostUnusual({ ...neutro, mundo: 90 }, cat)).toEqual({ axis: 'mundo', pct: 75 });
});
test('posição mais comum = mais perto da mediana', () => {
  const cat = [10, 20, 30].map(x => ({ ...neutro, controle: x, guia: 90 }));
  expect(mostCommon({ ...neutro, controle: 20, guia: 10 }, cat)).toEqual({ axis: 'controle', centered: false });
});
