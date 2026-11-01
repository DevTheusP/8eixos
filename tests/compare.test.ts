import { compareVectors } from '@/lib/compare';
import { AXIS_IDS, type Vector } from '@/lib/types';

const neutro = Object.fromEntries(AXIS_IDS.map(a => [a, 50])) as Vector;

test('comparação ordena pela maior diferença', () => {
  const r = compareVectors({ ...neutro, guia: 10 }, { ...neutro, guia: 90, verdade: 60 });
  expect(r).toHaveLength(8);
  expect(r[0]).toMatchObject({ axis: 'guia', a: 10, b: 90, diff: 80, sameSide: false });
  expect(r[1]).toMatchObject({ axis: 'verdade', diff: 10, sameSide: true });
});
